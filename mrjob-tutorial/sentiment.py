from mrjob.job import MRJob
import os
import re

class MRSentiment(MRJob):
    def mapper_init(self):
        self.weights = {}
        with open('C:/Users/SuperLinguini/Documents/Clubs GT/Big Data/mrjob-tutorial/sentiments.txt', 'r') as f:
            for line in f:
                ls = re.split('\s+', line.strip().lower());
                if len(ls) == 2:
                    word = ls[0]
                    word = re.sub('\W', '', word)
                    self.weights[word] = float(ls[1])

    def mapper(self, _, line):
        ls = line.lower().split()
        count = 0
        for word in ls:
            if word in self.weights:
                count += self.weights[word]
            yield word, count

    def reducer(self, key, values):
        tot, n = 0.0, 0.0
        for value in values:
            n += 1
            tot += value
        yield (key, tot/n)

def windows_fix():
    # Windows can't make symlinks without being an Administrator.
    # Workaround: Pretend we can't make symlinks and mrjob will work without them.
    # https://github.com/Yelp/mrjob/blob/cc64250308ebf887f4dfe24959f3877a1cd31404/mrjob/sim.py#L123
    if os.name == 'nt':
        del os.symlink

if __name__ == '__main__':
    windows_fix()
    MRSentiment.run()