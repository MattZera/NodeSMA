#!/usr/bin/env python3
import signal
import sys
import json
import os
import re

directory = os.path.dirname(os.path.abspath(__file__))

import nltk

# Set the nltk data path
nltk.data.path.append(directory + "/nltk_data")

# import vader analyzer
from textblob import TextBlob


# setup signal handling
def signal_handler(signal, frame):
    print('You pressed Ctrl+C!')
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)


def clean_tweet(tweet):
    return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())


def main():
    # Go over each line of stdin and flush after each write

    data = sys.argv[len(sys.argv) - 1]
    sentimentScores = TextBlob(clean_tweet(data))

    analysis = {}

    analysis["compound"] = sentimentScores.sentiment.polarity

    sys.stdout.write(json.dumps(analysis))
    return 0


if __name__ == '__main__':
    main()
