CXX = g++
CXXFLAGS = -std=c++11 -Wall

## SYSTEM SPECIFIC ##
##   comment out the block corresponding to your OS before building.
##   see https://github.com/hingobway/mixutilities/wiki for
##	 more information.

# # MacOS:
# INCLUDES = -Iinclude -I$(BOOST_ROOT)
# LIBS = -lportmidi -framework coremidi
# BOOST_ROOT := /usr/local/boost_1_82_0

# # Windows:
# INCLUDES = -Iinclude -I$(BOOST_ROOT) -I$(PAC_ROOT)/include
# LIBS = -lwsock32 -lws2_32 -L$(PAC_ROOT)/lib -lportmidi
# BOOST_ROOT := C:/Program\ Files/boost/boost_1_81_0
# PAC_ROOT := C:/msys64/mingw64

#####################

out_file = mxu

headers = MidiIO.hpp Primary.hpp ws_server.hpp 
objects = main.o MidiIO.o Primary.o ws_server.o

$(out_file): $(objects)
	$(CXX) -o $@ $^ $(CXXFLAGS) $(LIBS)

$(objects): %.o: %.cpp $(headers)
	$(CXX) -c -o $@ $< $(CXXFLAGS) $(INCLUDES)

.PHONY: clean
clean:
	rm -f *.o $(out_file)
