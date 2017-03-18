#!/usr/bin/env python3
import signal
import sys
import json
import os
directory = os.path.dirname(os.path.abspath(__file__))

import nltk
# Set the nltk data path
nltk.data.path.append(directory+"/nltk_data")

#import vader analyzer
from nltk.sentiment.vader import SentimentIntensityAnalyzer


# setup signal handling
def signal_handler(signal, frame):
    print('You pressed Ctrl+C!')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)


def main():
# Go over each line of stdin and flush after each write
    data = sys.argv[len(sys.argv)-1]
    sid = SentimentIntensityAnalyzer()
    sentimentScores = sid.polarity_scores(data)

    sys.stdout.write(json.dumps(sentimentScores))
    return 0

if __name__ == '__main__':
    main()
