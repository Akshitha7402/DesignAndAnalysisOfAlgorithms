#include <bits/stdc++.h>
using namespace std;

bool isPair(char a, char b) 
{
    return (a == 'A' && b == 'U') || (a == 'U' && b == 'A') ||
           (a == 'C' && b == 'G') || (a == 'G' && b == 'C');
}

void traceback(const vector< vector<int> >& DP, const string& RNA, int i, int j, vector< pair<int, int> >& structure) 
{
    if (i >= j) 
        return;

    if (DP[i][j] == DP[i][j - 1]) 
    {
        traceback(DP, RNA, i, j - 1, structure);
    } 

    else 
    {
        for (int t = i; t < j; ++t) 
        {
            if (DP[i][j] == DP[i][t - 1] + DP[t + 1][j - 1] + 1 && isPair(RNA[t - 1], RNA[j - 1])) 
            {
                structure.push_back({t, j});
                traceback(DP, RNA, i, t - 1, structure);
                traceback(DP, RNA, t + 1, j - 1, structure);
                return;
            }
        }
    }
}

vector<pair<int, int>> computeOptimalStructure(const string& RNA) 
{
    int n = RNA.length();
    vector< vector<int>> DP(n + 1, vector<int>(n + 1, 0));
    vector< pair<int, int> > structure;

    // Base cases
    for (int i = 0; i < n; ++i) 
    {
        for (int j = i; j <= min(i + 4, n); ++j) 
        {
            DP[i][j] = 0;
        }
    }

    // Dp filling
    for (int k = 5; k < n; ++k) 
    {
        for (int i = 1; i <= n - k; ++i) 
        {
            int j = i + k;
            DP[i][j] = DP[i][j - 1];
            for (int t = i; t < j - 4; ++t) 
            {
                if (isPair(RNA[t - 1], RNA[j - 1])) 
                {
                    DP[i][j] = max(DP[i][j], DP[i][t - 1] + DP[t + 1][j - 1] + 1);
                }
            }
        }
    }

    traceback(DP, RNA, 1, n, structure);
    return structure;
}

int main() {
    ifstream inputFile("input.txt"); // Open the input file
    if (!inputFile.is_open()) {
        cerr << "Could not open the file - 'input.txt'" << endl;
        return EXIT_FAILURE;
    }

    string RNA;
    inputFile >> RNA; // Read the RNA sequence from the file
    inputFile.close(); // Close the file after reading

    if (RNA.empty()) {
        cerr << "RNA sequence is empty" << endl;
        return EXIT_FAILURE;
    }

    vector<pair<int, int>> structure = computeOptimalStructure(RNA);
    
    sort(structure.begin(), structure.end());
    cout << "Max num of base pairs: " << structure.size() << endl;
    for (const auto& p : structure) 
    {
        cout << "(" << p.first << ", " << p.second << ")" << endl;
    }

    string dotBracket(RNA.length(), '.');
    for (const auto& pair : structure) 
    {
        dotBracket[pair.first - 1] = '(';
        dotBracket[pair.second - 1] = ')';
    }

    cout << RNA << endl;
    cout << dotBracket << endl;

    return 0;
}
