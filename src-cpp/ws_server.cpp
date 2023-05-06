/* class: ws_server */

#include "ws_server.hpp"

#include <iostream>
#include <functional>
#include <string>
#include <sstream>

#include <boost/function.hpp>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

ws_server::ws_server(int port) : port_(port), locked_{false}
{
  // set logging settings
  endpoint_.set_error_channels(websocketpp::log::elevel::all);
  endpoint_.set_access_channels(websocketpp::log::alevel::all ^ websocketpp::log::alevel::frame_payload);
  endpoint_.set_reuse_addr(true);

  // init server with internal network management
  endpoint_.init_asio();

  // bind default message handler...
  endpoint_.set_message_handler(
      std::bind(
          &ws_server::on_message, this,
          std::placeholders::_1, std::placeholders::_2));
}
void ws_server::run(boost::function<void()> cb_ready, boost::function<void(std::string)> cb_msg_handler)
{
  this->cb_ready_ = cb_ready;
  this->cb_msg_handler_ = cb_msg_handler;

  // start listening
  endpoint_.listen(this->port_);

  // start accepting connections
  endpoint_.start_accept();

  // start the asio io_service run loop
  endpoint_.run();
}

// send message to client
int ws_server::send(json msg)
{
  if (!this->locked_)
    return 1; // no client connection yet

  // otherwise send message
  this->endpoint_.send(this->hdl_, msg.dump(), websocketpp::frame::opcode::text);
  // TODO any way to check for receive?

  return 0;
}

// global message handler
void ws_server::on_message(websocketpp::connection_hdl hdl, server::message_ptr msg)
{
  json jmsg = json::parse(msg->get_payload());
  std::string type = jmsg["type"];

  std::cout << "packet from client - TYPE `" << type << "`"
            << "\n";

  if (type == "announce")
  {
    this->hdl_ = hdl;
    if (!this->locked_)
    {
      this->locked_ = true;
    }
    this->cb_ready_();
  }
  else
  {
    this->cb_msg_handler_(jmsg.dump());
  }
}
