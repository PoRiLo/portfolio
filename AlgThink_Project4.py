"""
Algorithmic Thinking Part 2, Module 4 - March 2016
Project 4

Created on Fri 18 Mar 17:12:35 2016
@author: Ruben Dorado Sanchez-Castillo

Student will implement four functions:

build_scoring_matrix(alphabet, diag_score, off_diag_score, dash_score)
compute_alignment_matrix(seq_x, seq_y, scoring_matrix, global_flag)
compute_global_alignment(seq_x, seq_y, scoring_matrix, alignment_matrix)
compute_local_alignment(seq_x, seq_y, scoring_matrix, alignment_matrix)
"""

def build_scoring_matrix(alphabet, diag_score, off_diag_score, dash_score):
    """
    Takes an alphabet of characters and the scoring pattern and returns an
    scoring matrix as a dictionary of dictionaries.

    Input:
    alphabet - a set of characters
    diag_score - score for the remaining diagonal entries
    off_diag_score - score for the remaining off-diagonal entries
    dash_score - score for any entry indexed by one of more dashes

    Returns:
    scoring_matrix - a dictionary of dictionaries whose entries are indexed by
    pairs of characters in alphabet plus '-'.
    """
    scoring_matrix = {}
    alphabet = list(alphabet)
    alphabet += "-"

    for base_i in alphabet:
        scoring_matrix[base_i] = {}
        for base_j in alphabet:
            if base_i == base_j:
                scoring_matrix[base_i][base_j] = diag_score
            else:
                scoring_matrix[base_i][base_j] = off_diag_score
            if base_i == '-' or base_j == '-':
                scoring_matrix[base_i][base_j] = dash_score

    return scoring_matrix

def compute_alignment_matrix(seq_x, seq_y, scoring_matrix, global_flag = True):
    """
    The function computes and returns the alignment matrix for two sequences.
    Depending on the input, it can be a global alingment or a local one.

    Input:
    seq_x and seq_y - two sequences whose elements share a common alphabet with
    the scoring matrix.
    scoring_matrix - the scoring matrix.
    global_flag - boolean to indicate whether we should return a global match
    or a local match

    Return:
    alignment_matrix - a list of lists which elements are the rows of the
    alignment matrix.
    """
    x_dim = len(seq_x) + 1
    y_dim = len(seq_y) + 1
    alignment_matrix = [[0 for dummy_j in range(y_dim)] for dummy_i in range(x_dim)]
    base = 0
    if global_flag:
        base = float('-inf')

    for idx_i in range(1, x_dim):
        alignment_matrix[idx_i][0] = max(alignment_matrix[idx_i - 1][0] + scoring_matrix[seq_x[idx_i - 1]]['-'], base)

    for idx_j in range(1, y_dim):
        alignment_matrix[0][idx_j] = max(alignment_matrix[0][idx_j - 1] + scoring_matrix['-'][seq_y[idx_j - 1]], base)

    for idx_i in range(1, x_dim):
        for idx_j in range(1, y_dim):
            diagonal = alignment_matrix[idx_i - 1][idx_j - 1] + scoring_matrix[seq_x[idx_i - 1]][seq_y[idx_j - 1]]
            vertical = alignment_matrix[idx_i - 1][idx_j] + scoring_matrix[seq_x[idx_i - 1]]['-']
            horizontal = alignment_matrix[idx_i][idx_j - 1] + scoring_matrix['-'][seq_y[idx_j - 1]]
            alignment_matrix[idx_i][idx_j] = max(diagonal, vertical, horizontal, base)

    return alignment_matrix

def compute_global_alignment(seq_x, seq_y, scoring_matrix, alignment_matrix):
    """
    This function computes an optimal global alignment of seq_x and seq_y.

    Input:
    seq_x and seq_y - two sequences whose elements share a common alphabet with
    the scoring matrix.
    scoring_matrix - the scoring matrix.
    alignment_matrix - the alignment matrix.

    Return:
    global_alignment - a tuple of the form (score, align_x, align_y) where
    score is the score of the global alignment align_x and align_y.
    """
    x_dim = len(seq_x)
    y_dim = len(seq_y)
    sol_x = ''
    sol_y = ''
    score = alignment_matrix[x_dim][y_dim]

    while x_dim > 0 and y_dim > 0:
        if alignment_matrix[x_dim][y_dim] == alignment_matrix[x_dim - 1][y_dim - 1] + scoring_matrix[seq_x[x_dim - 1]][seq_y[y_dim - 1]]:
            sol_x = seq_x[x_dim - 1] + sol_x
            sol_y = seq_y[y_dim - 1] + sol_y
            x_dim -= 1
            y_dim -= 1
        else:
            if alignment_matrix[x_dim][y_dim] == alignment_matrix[x_dim - 1][y_dim] + scoring_matrix[seq_x[x_dim - 1]]['-']:
                sol_x = seq_x[x_dim - 1] + sol_x
                sol_y = '-' + sol_y
                x_dim -= 1
            else:
                sol_x = '-' + sol_x
                sol_y = seq_y[y_dim - 1] + sol_y
                y_dim -= 1

    while x_dim > 0:
        sol_x = seq_x[x_dim - 1] + sol_x
        sol_y = '-' + sol_y
        x_dim -= 1

    while y_dim > 0:
        sol_x = '-' + sol_x
        sol_y = seq_y[y_dim - 1] + sol_y
        y_dim -= 1

    return (score, sol_x, sol_y)

def compute_local_alignment(seq_x, seq_y, scoring_matrix, alignment_matrix):
    """
    This function computes an optimal local alignment of seq_x and seq_y.

    Input:
    seq_x and seq_y - two sequences whose elements share a common alphabet with
    the scoring matrix.
    scoring_matrix - the scoring matrix.
    alignment_matrix - the alignment matrix.

    Return:
    global_alignment - a tuple of the form (score, align_x, align_y) where
    score is the score of the global alignment align_x and align_y.
    """
    x_dim = len(seq_x)
    y_dim = len(seq_y)
    sol_x = ''
    sol_y = ''
    score = float('-inf')

    for idx_i in range(len(seq_x) + 1):
        for idx_j in range(len(seq_y) + 1):
            if alignment_matrix[idx_i][idx_j] >= score:
                score = alignment_matrix[idx_i][idx_j]
                x_dim = idx_i
                y_dim = idx_j

    while alignment_matrix[x_dim][y_dim] > 0:
        if alignment_matrix[x_dim][y_dim] == alignment_matrix[x_dim - 1][y_dim - 1] + scoring_matrix[seq_x[x_dim - 1]][seq_y[y_dim - 1]]:
            sol_x = seq_x[x_dim - 1] + sol_x
            sol_y = seq_y[y_dim - 1] + sol_y
            x_dim -= 1
            y_dim -= 1
        else:
            if alignment_matrix[x_dim][y_dim] == alignment_matrix[x_dim - 1][y_dim] + scoring_matrix[seq_x[x_dim - 1]]['-']:
                sol_x = seq_x[x_dim - 1] + sol_x
                sol_y = '-' + sol_y
                x_dim -= 1
            else:
                sol_x = '-' + sol_x
                sol_y = seq_y[y_dim - 1] + sol_y
                y_dim -= 1

    return (score, sol_x, sol_y)

# Tests for compute_global_alignment
#x_seq = 'abddcdeffgh'
#y_seq = 'aabcddefghij'
#alfabeto = 'abcdefghij'
#puntuacion = build_scoring_matrix(alfabeto, 2, -1, -1)
#es_global = True
#matriz = compute_alignment_matrix(x_seq, y_seq, puntuacion, es_global)
#print compute_global_alignment(x_seq, y_seq, puntuacion, matriz)

# Tests for compute_local_alignment
#x_seq = 'TTAGC'
#y_seq = 'ACTTATTTGAGCCCTGCA'
#alfabeto = 'ACTG'
#puntuacion = build_scoring_matrix(alfabeto, 6, 2, -4)
#es_global = False
#matriz = compute_alignment_matrix(x_seq, y_seq, puntuacion, es_global)
#print compute_local_alignment(x_seq, y_seq, puntuacion, matriz)