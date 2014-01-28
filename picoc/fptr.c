#include <stdio.h>

void printFunction(int (*fPtr)(int)) {
  printf("func is at %p\n", fPtr);
}

int interestingFunc(int a) {
  printf("hai there!\n");
  return a * 2;
}

int main(int argc, char** argv) {
  printFunction(interestingFunc);
}
