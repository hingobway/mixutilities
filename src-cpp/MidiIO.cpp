/* class MidiIO */
#include "MidiIO.hpp"

#include <iostream>
#include <iomanip>
#include <sstream>
#include <vector>
#include <cassert>

#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include "Primary.hpp"

bool MidiIO::is_active_ = false;
std::vector<unsigned char> MidiIO::receive_msg_ = {};
int MidiIO::receive_msg_count_ = -1;
PmStream *MidiIO::istream_ = nullptr;
PmStream *MidiIO::ostream_ = nullptr;
PmQueue *MidiIO::midi_to_main_ = nullptr;
PmQueue *MidiIO::main_to_midi_ = nullptr;

MidiIO::MidiIO() : inputDevices_{}, outputDevices_{}
{

  // create queues
  MidiIO::midi_to_main_ = Pm_QueueCreate(32, sizeof(int32_t));
  // std::assert(MidiIO::midi_to_main_ != nullptr);
  if (MidiIO::midi_to_main_ == nullptr)
    throw std::runtime_error("error creating midi_to_main queue");
  MidiIO::main_to_midi_ = Pm_QueueCreate(32, sizeof(int32_t));
  // std::assert(MidiIO::main_to_midi_ != nullptr);
  if (MidiIO::main_to_midi_ == nullptr)
    throw std::runtime_error("error creating main_to_midi queue");

  // TODO test queueing here (see midithread-test.c:233)

  // start the timer!
  Pt_Start(1, &MidiIO::receiveMidi, 0);

  Pm_Initialize();

  int device_count{-1};

  if (!(device_count = Pm_CountDevices()))
  { //  no midi devices found
    // TODO handle no midi devices
  }

  for (int i{0}; i < device_count; i++)
  {
    const PmDeviceInfo *d = Pm_GetDeviceInfo(i);
    if (d->input)
      this->inputDevices_[i] = d->name;
    if (d->output)
      this->outputDevices_[i] = d->name;
  }
}

// main io functions
void MidiIO::initIO(int inID, int outID)
{
  if (MidiIO::is_active_)
  {
    Pm_Close(MidiIO::istream_);
    Pm_Close(MidiIO::ostream_);
  }

  Pm_OpenOutput(&MidiIO::ostream_, outID, nullptr, MIDI_OUT_BUFFER_SIZE, nullptr, nullptr, 0);
  Pm_OpenInput(&MidiIO::istream_, inID, nullptr, MIDI_IN_BUFFER_SIZE, nullptr, nullptr);

  // now we are activated
  MidiIO::is_active_ = true;
}
void MidiIO::receiveMidi(PtTimestamp timestamp, void *userData)
{
  if (!MidiIO::is_active_)
    return; // don't read data until active

  int result;
  int count;
  PmEvent buffer;
  int32_t msg;
  std::stringstream st;
  std::string sto{};
  json jup;
  MidiIO::MIDIMessage nmsg{};
  MidiIO::MIDIMessage mg1{0x250000, 1, 1}; // TODO move this somewhere for constants

  // check for output requests // TODO finish alongside send() method
  do
  {
    result = Pm_Dequeue(MidiIO::main_to_midi_, &msg);
    if (result)
    { // there is data to send
      // if
    }
  } while (result);

  // check for input
  int shift{}, data{}, i{};

  while (data != MIDI_EOX)
  {
    count = Pm_Read(MidiIO::istream_, &buffer, 1);
    if (!count)
      return;

    for (shift = 0; shift < 32 && (data != MIDI_EOX); shift += 8)
    {
      data = (buffer.message >> shift) & 0xFF;
      MidiIO::receive_msg_.push_back(data);
    }
  }
  // check message validity
  if (MidiIO::receive_msg_.at(0) != MIDI_SYSEX)
  {
    std::cout << "error: incoming message doesn't begin with sysex identify\n";
    goto error;
  }
  count = 0;
  for (i = 0; i < 5; i++)
    count += MidiIO::receive_msg_.at(i + 1) << (7 * i);

  if (MidiIO::receive_msg_.back() != MIDI_EOX)
  {
    std::cout << "error: no end of sysex\n";
    goto error;
  }

  for (auto &it : MidiIO::receive_msg_)
    st << std::hex << std::setw(2) << std::setfill('0') << (int)it << " ";
  sto = st.str();
  std::cout << "received: " << sto << "\n";

  nmsg = MidiIO::hex2s(MidiIO::receive_msg_);

  // mute group hijack
  if (nmsg.ac == mg1.ac && nmsg.chan == mg1.chan && nmsg.val == mg1.val)
  {
    nmsg.val = 0;
    MidiIO::send(nmsg);
    jup["type"] = "button_push";
    Primary::run_macro();
  }
  else
  {
    Primary::push_mem(nmsg);

    jup["type"] = "midi_update";
    jup["data"] = {{"raw", st.str()}};
  }
  Primary::get_ui()->send(jup);

  // before next message...
  MidiIO::receive_msg_.clear();
  MidiIO::receive_msg_count_--;
  return;
error:
  return; // TODO add something else here?
}

void MidiIO::send(MidiIO::MIDIMessage &msg)
{
  if (MidiIO::ostream_ == nullptr)
  {
    // TODO handle error
    std::cout << "error: midi send requested but no output stream is available.\n";
    return;
  }

  auto output = MidiIO::s2hex(msg);

  // TODO rewrite to use queueing
  Pm_WriteSysEx(MidiIO::ostream_, 0, output.data());
}

MidiIO::MIDIMessage MidiIO::hex2s(const std::vector<unsigned char> &msg)
{
  MidiIO::MIDIMessage sm{};
  sm.ac = (unsigned int)msg.at(7) << 16 | (unsigned int)msg.at(8) << 8 | (unsigned int)msg.at(9);
  sm.chan = (unsigned int)msg.at(10) << 8 | (unsigned int)msg.at(11);
  sm.val = (unsigned long)msg.at(12) << 32 | (unsigned long)msg.at(13) << 24 | (unsigned long)msg.at(14) << 16 | (unsigned long)msg.at(15) << 8 | (unsigned long)msg.at(16);
  sm.chan++;
  return sm;
}
std::vector<unsigned char> MidiIO::s2hex(const MidiIO::MIDIMessage &sm)
{
  std::vector<unsigned char> message{/* 00 */ 0xF0, 0x43, 0x10, 0x3E, 0x19, 0x01, 0x00, // signature
                                     /* 07 */ 0x00, 0x00, 0x00,                         // action + channel type
                                     /* 10 */ 0x00, 0x00,                               // channel (definitely 11, maybe also 10)
                                     /* 12 */ 0x00, 0x00, 0x00, 0x00, 0x00,             // value
                                     /* 17 */ 0xF7};                                    // end of message

  // set ac
  message.at(7) = (sm.ac >> 16) & 0xFF;
  message.at(8) = (sm.ac >> 8) & 0xFF;
  message.at(9) = sm.ac & 0xFF;
  // set chan
  unsigned int chan = sm.chan - 1;
  message.at(10) = (chan >> 8) & 0xFF;
  message.at(11) = chan & 0xFF;
  // set val
  message.at(12) = (sm.val >> 32) & 0xFF;
  message.at(13) = (sm.val >> 24) & 0xFF;
  message.at(14) = (sm.val >> 16) & 0xFF;
  message.at(15) = (sm.val >> 8) & 0xFF;
  message.at(16) = sm.val & 0xFF;

  return message;
}

MidiIO::~MidiIO()
{ // destructor
  Pt_Stop();
  Pm_QueueDestroy(MidiIO::midi_to_main_);
  Pm_QueueDestroy(MidiIO::main_to_midi_);
  Pm_Close(MidiIO::istream_);
  Pm_Close(MidiIO::ostream_);
  Pm_Terminate();

  // TODO Pm_Close(stream) for input too
}
