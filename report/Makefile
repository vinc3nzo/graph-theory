SOURCE=main
TARGET=Mangasaryan_351
FLAGS=-shell-escape -jobname=$(TARGET) -file-line-error

all: $(TARGET)

$(TARGET): $(SOURCE).tex preamble.sty $(wildcard *.tex)
	pdflatex $(FLAGS) $^
	pdflatex $(FLAGS) $^

clean:
ifeq ($(OS),Windows_NT)
	del /F /S /Q $(wildcard *.pdf) $(wildcard *.toc) $(wildcard *.synctex.gz) \
	$(wildcard *.out) $(wildcard *.log) $(wildcard *.aux) $(wildcard *.bbl) \
	$(wildcard *.blg) $(wildcard _minted-*) \
	$(wildcard *.fdb_latexmk) $(wildcard *.fls)
else
	rm -rf $(wildcard *.pdf) $(wildcard *.toc) $(wildcard *.synctex.gz) \
	$(wildcard *.out) $(wildcard *.log) $(wildcard *.aux) $(wildcard *.bbl) \
	$(wildcard *.blg) $(wildcard _minted-*) \
	$(wildcard *.fdb_latexmk) $(wildcard *.fls)
endif
