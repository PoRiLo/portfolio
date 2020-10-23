"""
Algorithmic Thinking Part 2, Module 4 - March 2016
Application 4

Created on Sat Mar 20 11:23:14 2016

@author: Ruben Dorado

"""

import time
import math
import random
import csv
import urllib2
import matplotlib.pyplot as plt
import AlgThink_Project4 as project4

###############################################
# provided code

# URLs for data files
PAM50_URL = "http://storage.googleapis.com/codeskulptor-alg/alg_PAM50.txt"
HUMAN_EYELESS_URL = "http://storage.googleapis.com/codeskulptor-alg/alg_HumanEyelessProtein.txt"
FRUITFLY_EYELESS_URL = "http://storage.googleapis.com/codeskulptor-alg/alg_FruitflyEyelessProtein.txt"
CONSENSUS_PAX_URL = "http://storage.googleapis.com/codeskulptor-alg/alg_ConsensusPAXDomain.txt"
WORD_LIST_URL = "http://storage.googleapis.com/codeskulptor-assets/assets_scrabble_words3.txt"

# Helper functions
def read_scoring_matrix(filename):
    """
    Read a scoring matrix from the file named filename.

    Argument:
    filename -- name of file containing a scoring matrix

    Returns:
    A dictionary of dictionaries mapping X and Y characters to scores
    """
    scoring_dict = {}
    scoring_file = urllib2.urlopen(filename)
    ykeys = scoring_file.readline()
    ykeychars = ykeys.split()
    for line in scoring_file.readlines():
        vals = line.split()
        xkey = vals.pop(0)
        scoring_dict[xkey] = {}
        for ykey, val in zip(ykeychars, vals):
            scoring_dict[xkey][ykey] = int(val)
    return scoring_dict

def read_protein(filename):
    """
    Read a protein sequence from the file named filename.

    Arguments:
    filename -- name of file containing a protein sequence

    Returns:
    A string representing the protein
    """
    protein_file = urllib2.urlopen(filename)
    protein_seq = protein_file.read()
    protein_seq = protein_seq.rstrip()
    return protein_seq

def read_words(filename):
    """
    Load word list from the file named filename.

    Returns a list of strings.
    """
    # load assets
    word_file = urllib2.urlopen(filename)

    # read in files as string
    words = word_file.read()

    # template lines and solution lines list of line string
    word_list = words.split('\n')
    print "Loaded a dictionary with", len(word_list), "words"
    return word_list

###############################################################################
# Application 4 - Answers

# Question 1
"""
Question 1 (2 pts)
First, load the files HumanEyelessProtein and FruitflyEyelessProtein using the
provided code. These files contain the amino acid sequences that form the eyeless
proteins in the human and fruit fly genomes, respectively. Then load the scoring
matrix PAM50 for sequences of amino acids. This scoring matrix is defined over
the alphabet {A,R,N,D,C,Q,E,G,H,I,L,K,M,F,P,S,T,W,Y,V,B,Z,X,-} which represents
all possible amino acids and gaps (the "dashes" in the alignment).
Next, compute the local alignments of the sequences of HumanEyelessProtein and
FruitflyEyelessProtein using the PAM50 scoring matrix and enter the score and local
alignments for these two sequences below. Be sure to clearly distinguish which
alignment is which and include any dashes ('-') that might appear in the local
alignment. This problem will be assessed according to the following two items:
Is the score of the local alignment correct? (Hint: The sum of the decimal digits
in the score is 20.)
Are the two sequences in the local alignments (with dashes included if inserted
by the algorithm) clearly distinguished and correct?
"""
#human = read_protein(HUMAN_EYELESS_URL)
#fruitfly = read_protein(FRUITFLY_EYELESS_URL)
#scoring = read_scoring_matrix(PAM50_URL)
#alignment = project4.compute_alignment_matrix(human, fruitfly, scoring, False)
#solution = project4.compute_local_alignment(human, fruitfly, scoring, alignment)
#print 'score = ' + str(solution[0])
#print 'calculated human protein sequence = ' + solution[1]
#print 'calculated fruitfly protein sequence = ' + solution[2]

# Question 2
#consensus = read_protein(CONSENSUS_PAX_URL)

def question2():
    """
    Question 2 (2 pts)

    To continue our investigation, we next consider the similarity of the two sequences
    in the local alignment computed in Question 1 to a third sequence. The file
    ConsensusPAXDomain contains a "consensus" sequence of the PAX domain; that is,
    the sequence of amino acids in the PAX domain in any organism. In this problem,
    we will compare each of the two sequences of the local alignment computed in
    Question 1 to this consensus sequence to determine whether they correspond to
    the PAX domain.
    Load the file ConsensusPAXDomain. For each of the two sequences of the local
    alignment computed in Question 1, do the following:

    Delete any dashes '-' present in the sequence.
    Compute the global alignment of this dash-less sequence with the ConsensusPAXDomain
    sequence.
    Compare corresponding elements of these two globally-aligned sequences (local vs.
    consensus) and compute the percentage of elements in these two sequences that
    agree.
    To reiterate, you will compute the global alignments of local human vs. consensus
    PAX domain as well as local fruitfly vs. consensus PAX domain. Your answer should
    be two percentages: one for each global alignment. Enter each percentage below.
    Be sure to label each answer clearly and include three significant digits of
    precision.
    """

    # Calculating global alignment of the human-firefly local alignment to the
    # consensus string
    q2_human = str(solution[1])
    q2_firefly = str(solution[2])
    q2_human = q2_human.replace('-', '')
    q2_firefly = q2_firefly.replace('-', '')
    q2_human_matrix = project4.compute_alignment_matrix(q2_human, consensus, scoring, True)
    q2_firefly_matrix = project4.compute_alignment_matrix(q2_firefly, consensus, scoring, True)
    q2_human_alignment = project4.compute_global_alignment(q2_human, consensus,
                                                           scoring,
                                                           q2_human_matrix)
    q2_firefly_alignment = project4.compute_global_alignment(q2_firefly, consensus,
                                                           scoring,
                                                           q2_firefly_matrix)

    # Calculating adjustment of human protein
    dim = len(q2_human_alignment[2])
    human_match = 0.0
    for idx_i in range(dim):
        if q2_human_alignment[1][idx_i] == q2_human_alignment[2][idx_i]:
            human_match += 1

    # Calculating adjustment of firefly protein
    dim = len(q2_firefly_alignment[2])
    firefly_match = 0.0
    for idx_i in range(dim):
        if q2_firefly_alignment[1][idx_i] == q2_firefly_alignment[2][idx_i]:
            firefly_match += 1

    # Printing the solution
    print 'Human protein match = ' + str(round((human_match/dim)*100, 2)) + ' %'
    print 'Firefly protein match = ' + str(round((firefly_match/dim)*100,2)) + ' %'
    print dim

#question2()

# Question 3
#n = 134.0
#k = 97.0
#p = 1.0/23.0
#print (math.factorial(n)/(math.factorial(k)*math.factorial(n-k)))*math.pow(p,k)*math.pow(1 - p, n- k)

# Question 4
def generate_null_distribution(seq_x, seq_y, scoring_matrix, num_trials):
    """
    creates an un-normalized distribution generated by performing the following
    process num_trials times:
        Generate a random permutation rand_y of the sequence seq_y using random.shuffle().
        Compute the maximum value score for the local alignment of seq_x and rand_y using the score matrix scoring_matrix.
        Increment the entry score in the dictionary scoring_distribution by one

    input:
    seq_x, seq_y - two sequences
    scoring_matrix - scoring matrix
    num_trials - number of trials

    return:
    scoring_distribution - a dictionary that represents an un-normalized distribution
    """
    scoring_distribution = {}

    while num_trials > 0:
        trial_y = ''.join([str(w) for w in random.sample(seq_y, len(seq_y))])
        trial_matrix = project4.compute_alignment_matrix(seq_x, trial_y, scoring_matrix, True)
        trial_max = 0
        for i in range(len(seq_x) + 1):
            for j in range(len(seq_y) + 1):
                if trial_matrix[i][j] > trial_max:
                    trial_max = trial_matrix[i][j]

        if trial_max in scoring_distribution.keys():
            scoring_distribution[trial_max] += 1
        else:
            scoring_distribution[trial_max] = 1
        num_trials -= 1

    return scoring_distribution

def write_distribution():
    human = read_protein(HUMAN_EYELESS_URL)
    fruitfly = read_protein(FRUITFLY_EYELESS_URL)
    scoring = read_scoring_matrix(PAM50_URL)
    NUM_TRIALS = 1000
    distribution = generate_null_distribution(human, fruitfly, scoring, NUM_TRIALS)

    outFile='X:\Python-repo\Algorithmic_Thinking/AlgThink_Application4_distribution.csv'

    with open(outFile,'w') as myfile:
        writer = csv.writer(myfile)
        #write everything to file
        writer.writerows(distribution.viewitems())

    return distribution

#write_distribution()

def question4_plot():
    """
    Calculates the running time of the clustering process for randomly generated
    sets of clusters ranging in size from 2 to 200. Plots the outcome
    """
    inFile='X:\Python-repo\Algorithmic_Thinking/AlgThink_Application4_distribution.csv'
    reader = csv.reader(open(inFile,'rb'))
    distribution = dict(map(int,x) for x in reader)

    # creating data series
    xvals = []
    non_normalized_yvals = []
    for key in distribution.keys():
        xvals.append(key)
        non_normalized_yvals.append(distribution[key])

    total = float(sum(non_normalized_yvals))
    yvals = [float(y_val)/total for y_val in non_normalized_yvals]


    # Plotting the outcome
    plt.bar(xvals, yvals, align ='center')
    plt.legend(loc='upper left')
    plt.title('Statistical hypothesis test - normalized distribution')
    plt.ylabel('normalized occurrence')
    plt.xlabel('max alignment scoring')
    plt.show()

# Plots the answer to question 4
#question4_plot()

# Question 5

def question5():
    inFile='X:\Python-repo\Algorithmic_Thinking/AlgThink_Application4_distribution.csv'
    reader = csv.reader(open(inFile,'rb'))
    distribution = dict(map(int,x) for x in reader)
    print
    print distribution

    mean = 0.0
    for key in distribution.keys():
        mean += float(key) * float(distribution[key])
    mean /= 1000.0
    print
    print 'mean = ' + str(mean)

    dif = [key - mean for key in distribution.keys()]
    sdev = math.sqrt(math.pow(sum(dif), 2)/1000)
    print 'standard deviation = ' + str(sdev)

    z_score = (875.0 - mean) / sdev
    print 'z = ' + str(z_score)

    return

question5()