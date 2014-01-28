#include "picoc.h"
#include <string.h>
#include <emscripten.h>

#define PICOC_STACK_SIZE (128*1024)

int main(int argc, char** argv) {
  EM_ASM(
	 pot = 0;
	 onmessage = function(event) {
	   if ('code' in event.data) {
	     Module.ccall('initPicoc', 'v', ['string'], [event.data.code]);
	   }
	   else if ('pot' in event.data) {
	     pot = event.data.pot;
	   }
	 }
	 );
  return 0;
}

const char* PROGRAM = "for(int i=2;i<=15;i++){digitalWrite(i,LOW);}setup();while(1){loop();}";

void EMSCRIPTEN_KEEPALIVE initPicoc(const char* src) {
  PicocInitialise(PICOC_STACK_SIZE);
  PicocParse("<PROGRAM>", src, strlen(src), TRUE, FALSE, TRUE);
  //PicocCallMain(0, 0);
  PicocParse("<DEFAULT>", PROGRAM, strlen(PROGRAM), TRUE, FALSE, TRUE);
}
