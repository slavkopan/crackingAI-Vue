#### IMPLEMENT KNN

from math import sqrt
 
# calculate the Euclidean distance between two vectors
def euclidean_distance(row1, row2):
	distance = 0.0
	for i in range(len(row1)-1):
		distance += (row1[i] - row2[i])**2
	return sqrt(distance)
 
# Locate the most similar neighbors
def get_neighbors(train, test_row, num_neighbors):
	distances = list()
	for train_row in train:
		dist = euclidean_distance(test_row, train_row)
		distances.append((train_row, dist))
	distances.sort(key=lambda tup: tup[1])
	neighbors = list()
	for i in range(num_neighbors):
		neighbors.append(distances[i][0])
	return neighbors
 
# Make a classification prediction with neighbors
def solution(train, num_neighbors, test_row):
	neighbors = get_neighbors(train, test_row, num_neighbors)
	output_values = [row[-1] for row in neighbors]
	prediction = max(set(output_values), key=output_values.count)
	return prediction




#### IMPLEMENT CLASSIFICATION ACCURACY
def solution(a, b):
    return np.sum(a == b)/len(a)



### DATA NORMALIZATION
import numpy as np

def solution(r):
  r -= np.mean(r)
  r /= np.std(r)
  return r



### SOFTMAX CLASSIFICATION ACCURACT
https://www.pythonlikeyoumeanit.com/Module3_IntroducingNumpy/Problems/ComputeAccuracy.htmlS



###  IMPLEMENT SENSITIVITY
import numpy as np


def solution(a ,b):
  tp, fn = 0.0, 0.0
  for i in range(len(a)):
    if b[i] == 1:
      if a[i] == 1:
        tp += 1
      else:
        fn += 1
        
  return tp/(tp+fn)








### IMPLEMENT SPECIFICITY
import numpy as np


def solution(a ,b):
  tn, fp = 0.0, 0.0
  for i in range(len(a)):
    if b[i] == 0:
      if a[i] == 0:
        tn += 1
      else:
        fp += 1
        
  return tn/(tn+fp)




# IMPLEMENT SOFMTAX

import numpy as np

def softmax(x):
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()
def softmax1(x):
    """Compute softmax values for each sets of scores in x."""
    return np.exp(x) / np.sum(np.exp(x), axis=0)



# IMPLEMENT F1 SCORE

import numpy as np


def solution(a ,b):
  tp, fn, tn, fp = 0.0, 0.0, 0.0, 0.0
  for i in range(len(a)):
    if b[i] == 1:
      if a[i] == 1:
        tp += 1
      else:
        fn += 1
    if b[i] == 0:
      if a[i] == 0:
        tn += 1
      else:
        fp += 1

  if tp +fp == 0:
    precision = 0
  else:
    precision = tp/(tp+fp)
  if tp + fn == 0:
    recall = 0
  else:
    recall = tp/(tp+fn)

  if precision ==0 and recall == 0:
    return 0.0
  return 2* (precision*recall)/(precision+recall)





# IMPLEMENT F1 SCORE Multiclass

import numpy as np


def solution(a ,b):






# IMPLEMENT MULTI CLASS SVM LOSS (2 VERSIONS, NOT VECTORIZED, HALF-VECOTORIZED) 231N

import numpy as np

def L_i(x, y, W):
  """
  unvectorized version. Compute the multiclass svm loss for a single example (x,y)
  - x is a column vector representing an image (e.g. 3073 x 1 in CIFAR-10)
    with an appended bias dimension in the 3073-rd position (i.e. bias trick)
  - y is an integer giving index of correct class (e.g. between 0 and 9 in CIFAR-10)
  - W is the weight matrix (e.g. 10 x 3073 in CIFAR-10)
  """
  delta = 1.0 # see notes about delta later in this section
  scores = W.dot(x) # scores becomes of size 10 x 1, the scores for each class
  correct_class_score = scores[y]
  D = W.shape[0] # number of classes, e.g. 10
  loss_i = 0.0
  for j in range(D): # iterate over all wrong classes
    if j == y:
      # skip for the true class to only loop over incorrect classes
      continue
    # accumulate loss for the i-th example
    loss_i += max(0, scores[j] - correct_class_score + delta)
  return loss_i

def L_i_vectorized(x, y, W):
  """
  A faster half-vectorized implementation. half-vectorized
  refers to the fact that for a single example the implementation contains
  no for loops, but there is still one loop over the examples (outside this function)
  """
  delta = 1.0
  scores = W.dot(x)
  # compute the margins for all classes in one vector operation
  margins = np.maximum(0, scores - scores[y] + delta)
  # on y-th position scores[y] - scores[y] canceled and gave delta. We want
  # to ignore the y-th position and only consider margin on max wrong class
  margins[y] = 0
  loss_i = np.sum(margins)
  return loss_i







# IMPLEMENT SIMPLE GRADIENT DESCENT UPDATE

import numpy as np

def solution(weights, grads, lr):
  return weights - lr*grads



# IMPLEMENT GRADIENT DESCENT UPDATES 231N



# BACKPROP ON SIMPLE MATH EQUATION 231N





# FEED FORWARD NEURA NETWORK COMPUTATION 231N




# IMPLEMENT DROPOUT 231N



# IMPLEMENT MOMENTUM

# IMPLEMENT ADAM

# IMPLEMENT RMSPROP

# IMPLEMENT ADAGRAD


# IMPLEMENT MULTI CLASS SVM LOSS FOR ALL TRAINING EXAMPLES (Fully vecotirzed) 231N







