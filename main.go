package main

import (
	"bufio"
	//"encoding/json"
	"fmt"
	//"bytes"
	"html/template"
	//"io"
	//"flag"
	"io/ioutil"
	"log"
	//"math"
	"mime"
	"net/http"
	"os"
	"path"
	//"sort"
	"strings"
	//"sync"
	//"time"
)

type Page struct {
	Title string
}

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	file, err := os.Open(tmpl + ".html")
	if err != nil {
		return
	}
	reader := bufio.NewReader(file)
	srcString := ""
	for {
		s, err := reader.ReadString('\n')
		if err != nil {
			break
		}
		srcString += s
	}
	t := template.Must(template.New("template").Delims("*(", ")*").Parse(srcString))
	e := t.Execute(w, p)
	if e != nil {
		log.Fatal(e)
	}
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	reqURI := strings.Split(r.RequestURI, ".")
	w.Header().Set("Content-Type", mime.TypeByExtension("."+reqURI[len(reqURI)-1]))
	cwd, err := os.Getwd()
	byteArr, err := ioutil.ReadFile(path.Join(cwd, r.RequestURI))
	if err != nil {
		log.Println(err)
	}
	w.Write(byteArr)
}

/*func analyzeTextHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", mime.TypeByExtension(".json"))
	text := r.FormValue("text")
	wordList := sortWordsByQuality(text)
	fmt.Println(len(wordList), wordList)
	response, _ := json.Marshal(wordList)

	w.Write(response)
}*/

func handler(w http.ResponseWriter, r *http.Request) {
	r.RequestURI = "main.html"
	serveFile(w, r)
}

func main() {
	fmt.Println("Opening Server")
	http.HandleFunc("/static/", serveFile)
	http.HandleFunc("/", handler)
	http.ListenAndServe(":80", nil)
}
