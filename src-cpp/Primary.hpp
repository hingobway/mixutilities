/* header: class Primary */

#ifndef PRIMARY_HPP
#define PRIMARY_HPP

#include <vector>

#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include "MidiIO.hpp"
#include "ws_server.hpp"

#define SEND_DELAY 50000

class Primary
{
private:
  static ws_server *ui_;
  static MidiIO *midi_;

  static bool recordOn_;
  static std::vector<MidiIO::MIDIMessage> midi_mem_;

public:
  Primary(int port);
  ~Primary();

  void ready();
  void msg_handler(std::string _msg);

  static ws_server *get_ui() { return ui_; }
  static MidiIO *get_midi() { return midi_; }

  static void push_mem(MidiIO::MIDIMessage msg);
  static void run_macro();
};

#endif
