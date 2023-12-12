from io import BytesIO
from PIL import Image
import keras
import sys
import numpy as np
import librosa
import matplotlib.pyplot as plt
from librosa import display
import gdown

class livePredictions:
    def __init__(self, path, file):
        self.path = path
        self.file = file

    def load_model(self):
        self.loaded_model = keras.models.load_model(self.path)
        return self.loaded_model.summary()

    def makepredictions(self):
        data, sampling_rate = librosa.load(self.file)
        mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sampling_rate, n_mfcc=40).T, axis=0)
        x = np.expand_dims(mfccs, axis=1)
        x = np.expand_dims(x, axis=0)
        predict_x=self.loaded_model.predict(x)
        predictions=np.argmax(predict_x,axis=1)
        return self.convertclasstoemotion(predictions),predict_x

    @staticmethod
    def convertclasstoemotion(pred):
        label_conversion = {'0': 'neutral',
                            '1': 'calm',
                            '2': 'happy',
                            '3': 'sad',
                            '4': 'angry',
                            '5': 'fearful',
                            '6': 'disgust',
                            '7': 'surprised'}

        for key, value in label_conversion.items():
            if int(key) == pred:
                label = value
        return label
    
def detect_emotion(audio_file):
        if audio_file is not None:
            pred = livePredictions(path='/home/dotes/Desktop/codeforces/MINOR-III/music/final_model.h5',file=audio_file)
            pred.load_model()
            emotion=pred.makepredictions() 
            return emotion
def extract_audio_features(data, sampling_rate):
        mfccs = librosa.feature.mfcc(y=data, sr=sampling_rate, n_mfcc=13)
        return mfccs

url = sys.argv[1]
output = 'myfile.wav'
gdown.download(url, output, quiet=False)

audio_file = "/home/dotes/Desktop/codeforces/MINOR-III/music/myfile.wav"   

if audio_file:
    emotion, predict_x = detect_emotion(audio_file)
print(emotion)  
        