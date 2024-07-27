#include <SFML/Graphics.hpp>
#include <vector>
#include <string>
#include <stack>
#include <iostream>
#include <utility>
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
                structure.push_back({ t, j });
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

sf::Vector2f calculatePosition(int index, float baseLength, float angleIncrement, string dotBracket) {
    sf::Vector2f position(400.0f, 300.0f); // Starting position
    float currentAngle = 0.0f;

    for (int i = 0; i < index; ++i) {
        float radAngle = currentAngle * (3.14159265f / 180.0f); // Convert degrees to radians
        position.x += cos(radAngle) * baseLength;
        position.y += sin(radAngle) * baseLength;

        if (dotBracket[i] == '(') {
            currentAngle -= angleIncrement;
        }
        else if (dotBracket[i] == ')') {
            currentAngle += angleIncrement;
        }
    }
    return position;
}


int main() 
{
    string RNA = "GCCGGGCGCGGUGGCGCGUGCCUGUAGUCCCAGCUACUCGGGAGGCUGAGGCUGGAGGAUCCCUUGAGUUCAGGAGUUCUGGGCUGUAGUGCGCUAUGCCGAUCGGGUGUCCGCACUGAGUUCGGCAUCAAUAUGGUGACCUCCCGGGAGCGGGGGACCACCAGGUUGCCUAAGGAGGGGUGAACCGGCCCAGGUCGGAAACGGAGCAGGUCAAAACUCCCGUGCUGAUCAGUAGUGGGAUUGCGCCUGUGAAUAGCCACUGCACUCCAGCCUGGGCAACAUAGUGAGACCCUGCCUCU";
    vector<std::pair<int, int>> structure = computeOptimalStructure(RNA);
    sort(structure.begin(), structure.end());

    string dotBracket(RNA.length(), '.');
    for (const auto& pair : structure) {
        dotBracket[pair.first - 1] = '(';
        dotBracket[pair.second - 1] = ')';
    }

    sf::RenderWindow window(sf::VideoMode(800, 600), "RNA Structure Visualization");

    const float radius = 250.0f; // Radius of the semicircle
    const sf::Vector2f center(400.0f, 300.0f); // Center of the semicircle

    // Calculate the angle increment based on the RNA length
    float angleIncrement = 180.0f / static_cast<float>(RNA.length() - 1);

    // Main loop
    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        window.clear(sf::Color::White);

        // Vector to hold the positions of the bases
        std::vector<sf::Vector2f> basePositions(RNA.length());

        // Calculate positions and draw the bases along a semicircle
        for (size_t index = 0; index < RNA.length(); ++index) {
            // Calculate the angle for this base
            float angle = angleIncrement * index * (3.14159265f / 180.0f); // Convert degrees to radians
            // Calculate the position of the base
            basePositions[index].x = center.x + radius * cos(angle);
            basePositions[index].y = center.y - radius * sin(angle); // Subtract because SFML's y-axis is inverted

            // Draw the base as a small circle or dot
            sf::CircleShape baseDot(2.0f);
            baseDot.setPosition(basePositions[index]);
            baseDot.setFillColor(sf::Color::Black);
            window.draw(baseDot);
        }

        // Draw lines between paired bases
        sf::VertexArray pairedLines(sf::Lines);
        for (const auto& pair : structure) {
            pairedLines.append(sf::Vertex(basePositions[pair.first - 1], sf::Color::Red));
            pairedLines.append(sf::Vertex(basePositions[pair.second - 1], sf::Color::Red));
        }

        // Draw everything
        window.draw(pairedLines);
        window.display();
    }

    return 0;
}
