import React from "react";

interface Rule {
  header: string;
  details: Array<string> | string;
}

const rules: Array<Rule> = [
  {
    header: "Introduction",
    details:
      "Wizard is a trick-taking card game for 3 to 6 players. It was designed by Ken Fisher from Toronto, Ontario in 1984.",
  },
  {
    header: "Playing Card Deck",
    details: "60-card deck (regular 52-card deck + 4 Wizards & 4 Jesters)",
  },
  {
    header: "Goal",
    details: "To win exactly the number of 'tricks' that you bid.",
  },
  {
    header: "Rounds",
    details: [
      "The amount of rounds are determined by how many players are in the game.",
      "You can play a shorter variant of the game of only 10 rounds.",
    ],
  },
  {
    header: "First Deal",
    details: [
      "Each player is dealt 1 card and the next card is turned face up to determine trump.",
      "Each player in turn announces how many tricks he expects to win.",
      "The player to the dealer's left plays a card and play continues in clockwise order.",
      "If possible, players must play the same suit as the card that is led. If not possible, players may play a trump card (to possibly win) or slough off a different suit card (to lose).",
      "Exception: A Wizard or a Jester can be played at any time. Wizards win tricks and jesters count as nothing (i.e., they lose).",
    ],
  },
  {
    header: "Winning a Trick",
    details:
      "A trick is won: By the first Wizard played. If no Wizard is played, by the highest trump card played. If no trump is played, by the highest card of the suit led.",
  },
  {
    header: "Scoring",
    details: [
      "A player gets 20 points if they make their bid plus 10 points for each trick won. You lose 10 points for each trick under or over your bid.",
      "1 bid + 1 trick won = 30 points",
      "2 bid + 3 tricks won = -10 points",
    ],
  },
  {
    header: "Subsequent Deals",
    details:
      "The full deck is reshuffled and 2 cards are dealt to each player for the second round, 3 for the third round and so on. The winner of a trick leads the first card of the next round.",
  },
];

export default () => (
  <>
    <h1>Here are the rules</h1>
    {rules.map((rule) => (
      <div>
        <h2>{rule.header}</h2>
        {Array.isArray(rule.details) ? (
          rule.details.map((detail) => <p>{detail}</p>)
        ) : (
          <p>{rule.details}</p>
        )}
      </div>
    ))}
  </>
);
