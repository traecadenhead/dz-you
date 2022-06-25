import argparse
import codecs
import os, sys, re
import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup

def save_page(url, file_path, pagepath='page'):
    def clean_filename(filename):
        try:
            q = filename.index("?")
            if q > 0:
                return filename[0:q]
        except:
            # do nothing
            print("nothing to see here")
        
        return filename

    def save_rename(soup, pagefolder, session, url, tag, inner):
        if not os.path.exists(pagefolder): # create only once
            os.mkdir(pagefolder)
        for res in soup.findAll(tag):   # images, css, etc..
            if res.has_attr(inner): # check inner tag (file object) MUST exists  
                try:
                    filename, ext = os.path.splitext(os.path.basename(res[inner])) # get name and extension
                    filename = re.sub('\W+', '', filename) + ext # clean special chars from name
                    fileurl = urljoin(url, res.get(inner))
                    filepath = os.path.join(pagefolder, clean_filename(filename))
                    # rename html ref so can move html and folder of files anywhere
                    res[inner] = os.path.join(os.path.basename(pagefolder), filename)
                    if not os.path.isfile(filepath): # was not downloaded
                        with open(filepath, 'wb') as file:
                            filebin = session.get(fileurl)
                            file.write(filebin.content)
                except Exception as exc:
                    print(exc, file=sys.stderr)
    session = requests.Session()
    html = codecs.open(file_path, 'r').read()
    soup = BeautifulSoup(html, "html.parser")
    path, _ = os.path.splitext(pagepath)
    pagefolder = path+'_files' # page contents folder
    tags_inner = {'img': 'src', 'link': 'href', 'script': 'src'} # tag&inner tags to grab
    for tag, inner in tags_inner.items(): # saves resource files and rename refs
        save_rename(soup, pagefolder, session, url, tag, inner)
    with open(path+'.html', 'wb') as file: # saves modified html doc
        file.write(soup.prettify('utf-8'))


parser = argparse.ArgumentParser()
parser.add_argument('--url', help='url of page to save')
parser.add_argument('--file', help='path to page to save')
args = parser.parse_args()

save_page(args.url, args.file)