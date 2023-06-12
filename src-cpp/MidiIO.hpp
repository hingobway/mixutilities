/* header: class MidiIO */

#ifndef MIDIIO_HPP
#define MIDIIO_HPP

#include <map>
#include <vector>
#include <string>

#include <portmidi.h>
#include <pmutil.h>
#include <porttime.h>

#define MIDI_SYSEX 0xf0
#define MIDI_EOX 0xf7

#define MIDI_IN_BUFFER_SIZE 0
#define MIDI_OUT_BUFFER_SIZE 100

class MidiIO
{
private:
  static bool is_active_;

  std::map<int, std::string> inputDevices_;
  std::map<int, std::string> outputDevices_;

  static PortMidiStream *istream_;
  static PortMidiStream *ostream_;

  static PmQueue *midi_to_main_;
  static PmQueue *main_to_midi_;

  static std::vector<unsigned char> receive_msg_;
  static int receive_msg_count_;
  static void receiveMidi(PtTimestamp ts, void *userData);

public:
  struct MIDIMessage
  {
    unsigned int ac;
    unsigned int chan;
    unsigned long long val;
  };

  MidiIO();
  ~MidiIO();

  std::map<int, std::string> getInputDevices() { return inputDevices_; }
  std::map<int, std::string> getOutputDevices() { return outputDevices_; }

  void initIO(int inID, int outID);

  static void send(MidiIO::MIDIMessage &msg);

  static MIDIMessage hex2s(const std::vector<unsigned char> &msg);
  static std::vector<unsigned char> s2hex(const MIDIMessage &msg);
};

#endif
