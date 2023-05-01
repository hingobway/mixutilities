CXX = g++
CXXFLAGS = -std=c++11 -Wall
INCLUDES = -Iinclude -I$(BOOST_ROOT)
LIBS = -lportmidi -framework coremidi

BOOST_ROOT := /usr/local/boost_1_82_0

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
