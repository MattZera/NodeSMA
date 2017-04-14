import urllib.request
from xml.etree import ElementTree as ET
from textblob import TextBlob
import pandas as pd
import operator
import json


def main():
    # fetch xml
    with urllib.request.urlopen('http://www.latimes.com/local/lanow/rss2.0.xml') as url:
        data = url.read()

    # set root element of xml file
    root = ET.fromstring(data)
    channel = root[0]

    # find all the news titles, date, author, links
    given_data = []

    for item in channel.findall('item'):
        title = str(item.find('title').text)
        date = str(item.find('pubDate').text)
        author = str(item[1].text)
        link = str(item.find('link').text)

        textForAnalyze = (str(item.find('title').text) +
                          str(item.find('description').text).replace('<p>', '').replace('</p>', '').replace('...', ''))
        polarity = TextBlob(textForAnalyze).sentiment.polarity

        given_data.append((title, date, author, link, polarity))

    labels = ['title', 'date', 'author', 'link', 'polarity']
    df = pd.DataFrame.from_records(given_data, columns=labels)
    json_f = df.reset_index().to_json(orient='records')

    print(json_f)


# start process
if __name__ == '__main__':
    main()
