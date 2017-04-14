#
# created by matthew zera 5/12/2017
#
import csv
import re
import json
from math import log

class NaiveBayes:
    def __init__(self):
        self.data = {}
        self.data['count'] = 0;
        self.data['classes'] = {}

    def save(self):
        with open('naive-bayes-data.json', 'w') as outfile:
            json.dump(self.data, outfile)

    def train(self, example, classifications):
        self.data['count'] += 1
        for classification in classifications:
            if not classification in self.data['classes']:
                self.data['classes'][classification] = {}
                self.data['classes'][classification]['features'] = {}
                self.data['classes'][classification]['count'] = 0
                self.data['classes'][classification]['probability'] = 0
            self.data['classes'][classification]['count'] += 1
            self.data['classes'][classification]['probability'] = self.data['classes'][classification]['count'] / \
                                                                  self.data['count']
            for feature in example:
                if not feature in self.data['classes'][classification]['features']:
                    self.data['classes'][classification]['features'][feature] = {}
                    self.data['classes'][classification]['features'][feature]['count'] = 0
                    self.data['classes'][classification]['features'][feature]['probability'] = 0

                self.data['classes'][classification]['features'][feature]['count'] += 1
                self.data['classes'][classification]['features'][feature]['probability'] = \
                    self.data['classes'][classification]['features'][feature]['count'] / \
                    self.data['classes'][classification]['count']

    def classify(self, example):
        results = {}
        for classification in self.data['classes']:
            probability = self.data['classes'][classification]['probability'];
            for feature in example:
                if feature in self.data['classes'][classification]['features']:
                    probability *= self.data['classes'][classification]['features'][feature]['probability']
                else:
                    probability *= 0
            results[classification] = probability

        return results

class BayesTextClassifier(NaiveBayes):

    def __init__(self):
        super(BayesTextClassifier, self).__init__()

    def addStopWords(self, words):
        self.stopwords.extend(words)

    def clean_text(self, text):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", text).split())

    def create_bigrams(self, array):
        array1 = array[:]
        array2 = array[:]

        array1.pop()
        array2.pop(0)

        rv = list(map(lambda x: ' '.join(list(x)),zip(array1, array2)))
        return rv


    def train(self, text, classifications):
        text = self.clean_text(text).split(' ')
        #text.extend(list(self.create_bigrams(text)))

        return super(BayesTextClassifier, self).train(text, classifications)

    def classify(self, text):
        text = self.clean_text(text).split(' ')
        #text.extend(list(self.create_bigrams(text)))

        return super(BayesTextClassifier, self).classify(text)


def get_max_value_key(d1):
    values = list(d1.values())
    keys = list(d1.keys())
    max_value_index = values.index(max(values))
    max_key = keys[max_value_index]
    return max_key

def main():
    print("😀")

    file = open('./training_sets/Sentiment Analysis Dataset.csv', 'r')
    reader = csv.DictReader(file, delimiter=',')

    training = []
    testing = []

    i = 0
    for line in reader:
        if i > 10000000000:
            break
        if i % 10 != 0:
            training.append(line)
        else:
            testing.append(line)
        i += 1
    file.close()

    bayes = BayesTextClassifier()
    for line in training:
        bayes.train(line['text'], [line['sentiment']])

    bayes.save()

    correct = 0
    total = 0
    for line in testing:
        total += 1
        if get_max_value_key(bayes.classify(line['text'])) == line['sentiment']:
            correct += 1

    percent = correct / float(total)
    print("correct: " + str(correct) + " total: " + str(total) + " percent: " + str(percent))

    return 0


if __name__ == '__main__':
    main()
