/* class: Primary */
#include "Primary.hpp"

#include <iostream>
#include <string>
#include <unistd.h>
#include <boost/function.hpp>
#include <boost/bind/bind.hpp>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include "ws_server.hpp"
#include "MidiIO.hpp"

ws_server *Primary::ui_ = nullptr;
MidiIO *Primary::midi_ = nullptr;

bool Primary::recordOn_{false};
std::vector<MidiIO::MIDIMessage> Primary::midi_mem_{};

Primary::Primary(int port)
{
  // this->ready_ptr_ = &ready;

  Primary::ui_ = new ws_server(port);
  Primary::midi_ = new MidiIO();

  Primary::ui_->run(boost::bind(&Primary::ready, this),
                    boost::bind(&Primary::msg_handler, this, boost::placeholders::_1));
}

void Primary::ready()
{
  std::cout << "\nready!\n\n";

  json msg;
  msg["type"] = "device_list";
  msg["data"] = {{"input", Primary::midi_->getInputDevices()},
                 {"output", Primary::midi_->getOutputDevices()}};
  int err = Primary::ui_->send(msg);
  if (err)
    std::cout << "error sending midi device list\n";
}

// MIDI MEMORY
void Primary::push_mem(MidiIO::MIDIMessage msg)
{
  if (!Primary::recordOn_)
    return;
  std::cout << "here!\n";
  if (!Primary::midi_mem_.size())
  {
    Primary::midi_mem_.push_back(msg);
    return;
  }
  MidiIO::MIDIMessage last = Primary::midi_mem_.back();
  if (last.ac == msg.ac && last.chan == msg.chan)
  {
    Primary::midi_mem_.pop_back();
    Primary::midi_mem_.push_back(msg);
  }
  else
  {
    bool found{false};
    for (int i = 0; i < Primary::midi_mem_.size(); i++)
    {
      if (Primary::midi_mem_.at(i).ac == msg.ac && Primary::midi_mem_.at(i).chan == msg.chan)
      {
        Primary::midi_mem_.at(i) = msg;
        found = true;
        break;
      }
    }
    if (!found)
      Primary::midi_mem_.push_back(msg);
  }
}
void Primary::run_macro()
{
  for (auto msg : Primary::midi_mem_)
  {
    usleep(SEND_DELAY);
    Primary::midi_->send(msg);
  }
}

// INCOMING UI MESSAGES
void Primary::msg_handler(std::string _msg)
{
  json msg = json::parse(_msg);
  std::string type = msg["type"];

  // primary message router.
  // TODO large routes should go in their own functions.
  if (type == "set_midi_devices")
  {
    std::cout << "setting midi input to " << msg["data"]["input"] << ", output to " << msg["data"]["output"] << "\n";
    Primary::midi_->initIO(msg["data"]["input"], msg["data"]["output"]);
  }
  if (type == "send_midi_msg")
  {
    std::cout << "trying to send midi message but presets don't work anymore\n";
    // Primary::midi_->send(msg["data"]["preset"]);
  }
  if (type == "set_record")
  {
    Primary::recordOn_ = msg["data"]["on"];
    std::cout << "record set to " << (Primary::recordOn_ ? "on" : "off") << "\n";
    if (!Primary::recordOn_)
    {
      std::cout << " -> recorded " << Primary::midi_mem_.size() << " messages\n";
    }
  }
  if (type == "clear_macro")
  {
    Primary::midi_mem_.clear();
    std::cout << "cleared macro\n";
  }
}
