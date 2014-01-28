#include "../picoc.h"
#include "../interpreter.h"
#include <emscripten.h>

#undef USE_READLINE

#ifdef USE_READLINE
#include <readline/readline.h>
#include <readline/history.h>
#endif

/* mark where to end the program for platforms which require this */
jmp_buf PicocExitBuf;
char printfBuf[4096];
size_t bufLoc = 0;

void PlatformCleanup()
{
}

/* get a line of interactive input */
char *PlatformGetLine(char *Buf, int MaxLen, const char *Prompt)
{
#ifdef USE_READLINE
    if (Prompt != NULL)
    {
        /* use GNU readline to read the line */
        char *InLine = readline(Prompt);
        if (InLine == NULL)
            return NULL;

        Buf[MaxLen] = '\0';
        strncpy(Buf, InLine, MaxLen-1);
        strncat(Buf, "\n", MaxLen-1);

        if (InLine[0] != '\0')
            add_history(InLine);

        free(InLine);
        return Buf;
    }
#endif

    if (Prompt != NULL)
        printf("%s", Prompt);

    fflush(stdout);
    return fgets(Buf, MaxLen, stdin);
}

/* get a character of interactive input */
int PlatformGetCharacter()
{
    fflush(stdout);
    return getchar();
}

extern void sendError(const char*, const char*, int, int);

void PlatformSourceError(const char *FileName, const char *SourceText, int Line, int CharacterPos) {
    sendError(FileName, SourceText, Line - 2, CharacterPos);
}

extern void sendMessage(char*);

char* EMSCRIPTEN_KEEPALIVE getPrintfBuf() {
    return printfBuf;
}

/* write a character to the console */
void EMSCRIPTEN_KEEPALIVE PlatformPutc(unsigned char OutCh, union OutputStreamInfo *Stream)
{
    //    putchar(OutCh);
    if (OutCh == '\n') {
	printfBuf[bufLoc] = '\0';
	sendMessage(getPrintfBuf());
	//	EM_ASM(postMessage({msg: Module.ccall('getPrintfBuf', 'string', [], [])}););
	bufLoc = 0;
    } else {
	printfBuf[bufLoc++] = OutCh;
    }
}

/* read a file into memory */
char *PlatformReadFile(const char *FileName)
{
    struct stat FileInfo;
    char *ReadText;
    FILE *InFile;
    int BytesRead;

    if (stat(FileName, &FileInfo))
        ProgramFail(NULL, "can't read file %s\n", FileName);

    ReadText = malloc(FileInfo.st_size + 1);
    if (ReadText == NULL)
        ProgramFail(NULL, "out of memory\n");

    InFile = fopen(FileName, "r");
    if (InFile == NULL)
        ProgramFail(NULL, "can't read file %s\n", FileName);

    BytesRead = fread(ReadText, 1, FileInfo.st_size, InFile);
    if (BytesRead == 0)
        ProgramFail(NULL, "can't read file %s\n", FileName);

    ReadText[BytesRead] = '\0';
    fclose(InFile);

    return ReadText;
}

/* read and scan a file for definitions */
void PicocPlatformScanFile(const char *FileName)
{
    char *SourceStr = PlatformReadFile(FileName);

    PicocParse(FileName, SourceStr, strlen(SourceStr), TRUE, FALSE, TRUE);
}

/* exit the program */
void PlatformExit(int RetVal)
{
    PicocExitValue = RetVal;
    longjmp(PicocExitBuf, 1);
}
