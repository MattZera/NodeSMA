#!/usr/bin/env python3
import os
directory = os.path.dirname(os.path.abspath(__file__))

import nltk

# Download the vader lexicon
nltk.download('vader_lexicon', directory+"/nltk_data")

nltk.download('all-corpora', directory+"/nltk_data")

# nltk.download()
