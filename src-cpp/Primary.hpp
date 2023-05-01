/* header: class Primary */

#ifndef PRIMARY_HPP
#define PRIMARY_HPP

#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include "MidiIO.hpp"
#include "ws_server.hpp"

class Primary
{
private:
  static ws_server *ui_;
  static MidiIO *midi_;

public:
  enum IODevice
  {
    INPUT,
    OUTPUT
  };

  Primary(int port);

  void ready();
  void msg_handler(std::string _msg);

  static ws_server *get_ui() { return ui_; }
  static MidiIO *get_midi() { return midi_; }
};

#endif
