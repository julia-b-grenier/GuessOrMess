import * as cheerio from 'cheerio';

const deckData = `
Hindsight bias	"<b><div><span style=""color: rgb(32, 33, 36); background-color: rgb(255, 255, 255); font-weight: 400;"">People’s tendency after learning about a given outcome to be overconfident about whether they could have predicted that outcome.</span></div></b>"
Hypothesis	"<b><div><span style=""color: rgb(32, 33, 36); background-color: rgb(255, 255, 255); font-weight: 400;"">A prediction about what will happen under particular circumstances.</span></div></b>"
Theory	A set of related propositions intended to describe some phenomenon or aspect of the world
Correlational research	"<b><div><span style=""color: rgb(32, 33, 36); background-color: rgb(255, 255, 255); font-weight: 400;"">Research that involves measuring two or more variables and assessing whether there is a relationship between them.</span></div></b>"
Experimental research	"<b><div><span style=""color: rgb(32, 33, 36); background-color: rgb(255, 255, 255); font-weight: 400;"">In social psychology, research that randomly assigns people to different conditions, or situations, enabling researchers to make strong inferences about why a relationship exists or how different situations affect behavior.&nbsp;</span></div></b>"
Third variable	"<b><div><span style=""color: rgb(32, 33, 36); background-color: rgb(255, 255, 255); font-weight: 400;"">A variable, often unmeasured in correlational research that can be the true explanation for the relationship between two other variables.</span></div></b>"
`;

const parseAnkiDeck = (deckData: string) => {
    const pairs: { question: string; answer: string }[] = [];
    const lines = deckData.split('\n').filter(line => line.trim() !== '');

    lines.forEach(line => {
        const [question, answerHTML] = line.split('\t');
        const $ = cheerio.load(answerHTML);
        const answer = $('span').text().trim();
        pairs.push({ question: question.trim(), answer });
    });

    return pairs;
};

const extractedPairs = parseAnkiDeck(deckData);
console.log(extractedPairs);
