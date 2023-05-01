/* header: class ws_server */

#ifndef WS_SERVER_HPP
#define WS_SERVER_HPP

#include <string>

#include <boost/function.hpp>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

typedef websocketpp::server<websocketpp::config::asio> server;

class ws_server
{
private:
  server endpoint_;
  uint16_t port_;
  websocketpp::connection_hdl hdl_;
  bool locked_;

  boost::function<void()> cb_ready_;
  boost::function<void(std::string)> cb_msg_handler_;

  void on_message(websocketpp::connection_hdl hdl, server::message_ptr msg);

public:
  ws_server(int port);

  void run(boost::function<void()> cb_ready, boost::function<void(std::string)> cb_msg_handler);
  int send(json msg);
};

#endif
