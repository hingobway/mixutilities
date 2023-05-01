#include <iostream>

#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include "Primary.hpp"

#define PORT 54200

int main()
{

  std::cout << "starting up...\n";

  // begin central logic (Primary class)
  Primary primary(PORT);

  std::cout << std::endl;
  return 0;
}
