let cl = console.log;
let ct = console.table;

// ===== Build Deck =====

function buildDeck() {
  let deck = [];
  const suits = ["Hearts", "Spades", "Diamonds", "Clubs"];
  for (let i = 2; i <= 14; i++) {
    suits.forEach((suit) => {
      deck.push(createCard(i, suit));
    });
  }

  return deck;
}

function createCard(rank, suit) {
  return {
    rank: rank,
    suit: suit,
    color: getColor(suit),
    name: getName(rank),
  };
}

function getName(rank) {
  let name = "";
  if (rank === 11) {
    name = "Jack";
  } else if (rank === 12) {
    name = "Queen";
  } else if (rank === 13) {
    name = "King";
  } else if (rank === 14) {
    name = "Ace";
  } else {
    name = rank;
  }
  return name;
}

function getColor(suit) {
  let color = "";

  if (suit === "Spades" || suit === "Clubs") {
    color = "Black";
  } else if (suit === "Hearts" || suit === "Diamonds") {
    color = "Red";
  }

  return color;
}

let deck = buildDeck();

// ===== Deal Cards =====

function dealHand() {
  let hand = [];

  for (let i = 0; i < 26; i++) {
    hand.push(dealCard(deck));
  }

  return hand;
}

function dealCard(deck) {
  let randIndex = Math.floor(Math.random() * deck.length);
  return deck.splice(randIndex, 1)[0];
}

// ===== Create Players =====

function createPlayer(name) {
  return {
    name: name,
    hand: dealHand(),
  };
}

let player1 = createPlayer("Nathan");
let player2 = createPlayer("Jacob");

// ===== Game variables =====

let table = [];
let round = 1;
let warsPlayed = 0;
let winner = undefined;

// ===== Game Logic =====

function playGame() {
  cl("========== START GAME ==========\n");

  while (player1.hand.length > 0 && player2.hand.length > 0 && round <= 50000) {
    playRound();
  }

  determineEnding();
}

// Round
function playRound() {
  cl(`===== Round ${round} =====`);

  let player1Card = player1.hand.shift();
  let player2Card = player2.hand.shift();
  cl(
    `${player1.name} played a ${player1Card.name} of ${player1Card.suit} and ${player2.name} played a ${player2Card.name} of ${player2Card.suit}`
  );

  table.push(player1Card, player2Card);
  compareCards(player1Card, player2Card);

  round++;
}

// Compare cards
function compareCards(card1, card2) {
  if (card1.rank > card2.rank) {
    collectCards(player1);
  } else if (card1.rank < card2.rank) {
    collectCards(player2);
  } else {
    war(player1, player2, table);
  }
}

// War
function war(player1, player2, table) {
  cl("===== WAR =====");
  warsPlayed++;
  if (checkCardShortage(player1, player2)) {
    return;
  }

  for (let i = 0; i < 3; i++) {
    table.push(player1.hand.shift(), player2.hand.shift());
  }

  let warCard1 = player1.hand.shift();
  let warCard2 = player2.hand.shift();

  table.push(warCard1, warCard2);

  cl(
    `${player1.name} played a ${warCard1.name} of ${warCard1.suit} and ${warCard2.name} played a ${warCard2.name} of ${warCard2.suit}`
  );

  compareCards(warCard1, warCard2);
}

function checkCardShortage(player1, player2) {
  let warShortage = false;

  if (player1.hand.length < 4) {
    autoWarWin(player2, player1);
    warShortage = true;
  } else if (player2.hand.length < 4) {
    autoWarWin(player1, player2);
    warShortage = true;
  }

  return warShortage;
}

function autoWarWin(warWinner, warLoser) {
  cl(
    `${warWinner.name} wins the war because ${warLoser.name} doesn't have enough cards.`
  );
  collectCards(warWinner);
}

// Collect cards from table
function collectCards(winner) {
  cl(`${winner.name} wins the round`);
  while (table.length > 0) {
    let card = table.shift();
    winner.hand.push(card);
  }
}

// ===== Determine winner or if max rounds is reached =====

function determineEnding() {
  if (player1.hand.length > player2.hand.length) {
    endGame(player1);
  } else if (player2.hand.length > player1.hand.length) {
    endGame(player2);
  }
}

// ===== End game =====
function endGame(winner) {
  cl(`\n========= END GAME ==========\n`);
  cl(`Congrats, ${winner.name} wins with ${winner.hand.length} cards!`);
  cl(`In this game, ${warsPlayed} wars were played.`);
}
// ===== Start Game =====
playGame();
