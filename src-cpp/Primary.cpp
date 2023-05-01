/* class: Primary */
#include "Primary.hpp"

#include <string>
#include <boost/function.hpp>
#include <boost/bind/bind.hpp>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include "ws_server.hpp"
#include "MidiIO.hpp"

ws_server *Primary::ui_ = nullptr;
MidiIO *Primary::midi_ = nullptr;

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
    std::cout << "trying to send midi message\n";
    Primary::midi_->send(msg["data"]["preset"]);
  }
}
