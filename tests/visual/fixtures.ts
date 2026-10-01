import type { Card, SpellTrapType } from "@/types/card";

const ART_URL = "/yugioh-card-maker/images/android-chrome-512x512.png";

const LONG_EFFECT =
    "Quando esta carta for Invocada por Invocação-Normal: você pode adicionar 1 monstro \"Dragão\" do seu Deck à sua mão. " +
    "Uma vez por turno: você pode descartar 1 carta; destrua 1 carta que seu oponente controla. " +
    "Se esta carta for destruída em batalha ou por um efeito de card: você pode Invocar por Invocação-Especial 1 monstro Nível 4 ou menor do seu Cemitério.\n" +
    "Você só pode usar cada efeito de \"New Card\" uma vez por turno.";

const RECORD_SENTENCES = [
    "Se esta carta estiver na sua Zona Pêndulo: você pode destruir esta carta e, se isso acontecer, adicione 1 monstro Mago do seu Deck à sua mão.",
    "Uma vez por turno, quando um card ou efeito for ativado que inclua um efeito que destrói um card no campo: você pode negar a ativação e, se isso acontecer, destrua esse card.",
    "Enquanto esta carta estiver com a face para cima no campo, os monstros que seu oponente controla perdem 500 de ATK para cada Marcador Mágico no campo.",
    "Se esta carta for enviada do campo para o Cemitério: você pode colocar 1 Marcador Mágico em cada card que você controla que possa ter um Marcador Mágico.",
    "Você pode remover 6 Marcadores Mágicos do seu campo; Invoque por Invocação-Especial esta carta da sua mão ou Cemitério, e depois coloque o mesmo número de Marcadores Mágicos nela.",
    "Durante a Fase Final: devolva à mão do dono o monstro Invocado por Invocação-Especial por este efeito.",
];

function cutAtLastWholeWord(text: string, maxLength: number): string {
    const cut = text.slice(0, maxLength);
    return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.]+$/, "") + ".";
}

function textOfLength(length: number): string {
    const sentences: string[] = [];
    while (sentences.join(" ").length < length) sentences.push(RECORD_SENTENCES[sentences.length % RECORD_SENTENCES.length]);
    return cutAtLastWholeWord(sentences.join(" "), length);
}

const HYPHENATED_TERMS_EFFECT =
    "Se esta carta for Invocada por Invocação-Normal ou Invocação-Especial: você pode Invocar por Invocação-Especial 1 monstro " +
    "Invocado por Invocação-Tributo do seu Cemitério, depois você pode Invocar por Invocação-Normal 1 monstro. " +
    "Durante a Fase Final, devolva à mão os monstros Invocados por Invocação-Especial por este efeito.";

const UNBROKEN_WORD ="InvocaçãoPorInvocaçãoEspecialDoCemitério".repeat(6);

const EFFECT_600_CHARS =cutAtLastWholeWord(LONG_EFFECT + " " + LONG_EFFECT, 600);
const PENDULUM_EFFECT_300_CHARS = cutAtLastWholeWord(LONG_EFFECT, 300);

const effectMonster: Card = {
    frame: "effect",
    name: "New Card",
    attribute: "light",
    level: 4,
    spellTrapType: "",
    artUrl: ART_URL,
    setCode: "TEST-PT000",
    typeLine: "Dragão/Efeito",
    effect: "Quando esta carta for Invocada por Invocação-Normal: compre 1 card.",
    atk: "1800",
    def: "1200",
    passcode: "12345678",
    copyright: "© 1996 KAZUKI TAKAHASHI",
    isPendulum: false,
    pendulumScaleLeft: "1",
    pendulumScaleRight: "12",
    pendulumEffect: "",
    linkArrows: [],
    linkRating: "",
};

const spellOrTrap = (frame: "spell" | "trap", spellTrapType: SpellTrapType): Card => ({
    ...effectMonster,
    frame,
    attribute: frame,
    spellTrapType,
    level: null,
    typeLine: "",
    atk: "",
    def: "",
    effect: "Selecione 1 monstro no campo; destrua esse alvo.",
});

const linkMonster: Card = { ...effectMonster, frame: "link", level: null, def: "" };

export const fixtures: Record<string, Card> = {
    "normal": {
        ...effectMonster,
        frame: "normal",
        name: "Dark Magician",
        attribute: "dark",
        level: 7,
        typeLine: "Mago",
        effect: "O mago supremo em termos de ataque e defesa.",
        atk: "2500",
        def: "2100",
    },
    "effect": effectMonster,
    "effect-long-text": { ...effectMonster, effect: LONG_EFFECT },
    "effect-long-name": {
        ...effectMonster,
        name: "Blue-Eyes Ultimate Chaos Dragon of the Absolute Ultra Edition",
        level: 12,
    },
    "effect-no-art": { ...effectMonster, artUrl: "" },
    "fusion": { ...effectMonster, frame: "fusion", attribute: "fire", level: 8, typeLine: "Dragão/Fusão/Efeito" },
    "ritual": { ...effectMonster, frame: "ritual", attribute: "water", level: 6, typeLine: "Guerreiro/Ritual/Efeito" },
    "synchro": { ...effectMonster, frame: "synchro", attribute: "wind", level: 8, typeLine: "Dragão/Sincro/Efeito" },
    "xyz": { ...effectMonster, frame: "xyz", attribute: "earth", level: 4, typeLine: "Máquina/Xyz/Efeito" },
    "link": {
        ...linkMonster,
        attribute: "dark",
        typeLine: "Ciberso/Link/Efeito",
        linkRating: "3",
        linkArrows: ["top", "bottom-left", "bottom-right"],
    },
    "link-all-arrows": {
        ...linkMonster,
        attribute: "divine",
        typeLine: "Ciberso/Link/Efeito",
        linkRating: "8",
        linkArrows: ["top-left", "top", "top-right", "left", "right", "bottom-left", "bottom", "bottom-right"],
    },
    "token": { ...effectMonster, frame: "token", level: 1, typeLine: "Demônio", effect: "", atk: "0", def: "0" },
    "spell-normal": spellOrTrap("spell", "normal"),
    "spell-quick": spellOrTrap("spell", "quick-play"),
    "spell-field": spellOrTrap("spell", "field"),
    "trap-continuous": spellOrTrap("trap", "continuous"),
    "trap-counter": spellOrTrap("trap", "counter"),
    "pendulum-effect": {
        ...effectMonster,
        isPendulum: true,
        pendulumScaleLeft: "4",
        pendulumScaleRight: "4",
        typeLine: "Mago/Pêndulo/Efeito",
        pendulumEffect: "Uma vez por turno: você pode aumentar a Escala Pêndulo desta carta em 1 até o fim deste turno.",
    },
    "pendulum-normal": {
        ...effectMonster,
        frame: "normal",
        isPendulum: true,
        typeLine: "Mago/Pêndulo",
        effect: "Um mago que controla o tempo com um pêndulo antigo.",
    },
    "pendulum-xyz": {
        ...effectMonster,
        frame: "xyz",
        isPendulum: true,
        typeLine: "Dragão/Xyz/Pêndulo/Efeito",
        pendulumEffect: LONG_EFFECT,
        effect: LONG_EFFECT,
    },
    "normal-max-text": { ...effectMonster, frame: "normal", typeLine: "Mago", effect: EFFECT_600_CHARS },
    "effect-max-text": { ...effectMonster, effect: EFFECT_600_CHARS },
    "link-max-text": { ...linkMonster, linkRating: "1", linkArrows: ["bottom"], effect: EFFECT_600_CHARS },
    "spell-long-text": { ...spellOrTrap("spell", "continuous"), effect: LONG_EFFECT },
    "spell-max-text": { ...spellOrTrap("spell", "equip"), effect: EFFECT_600_CHARS },
    "trap-max-text": { ...spellOrTrap("trap", "normal"), effect: EFFECT_600_CHARS },
    "pendulum-max-text": {
        ...effectMonster,
        isPendulum: true,
        typeLine: "Mago/Pêndulo/Efeito",
        pendulumEffect: PENDULUM_EFFECT_300_CHARS,
        effect: EFFECT_600_CHARS,
    },
    "calib-pendulum-endymion": {
        ...effectMonster,
        isPendulum: true,
        typeLine: "Mago/Pêndulo/Efeito",
        pendulumEffect: textOfLength(450),
        effect: textOfLength(750),
    },
    "calib-effect-record": { ...effectMonster, effect: textOfLength(700) },
    "calib-normal-record": { ...effectMonster, frame: "normal", typeLine: "Guerreiro", effect: textOfLength(830) },
    "calib-spell-record": { ...spellOrTrap("spell", "quick-play"), effect: textOfLength(700) },
    "calib-trap-record": { ...spellOrTrap("trap", "counter"), effect: textOfLength(700) },
    "calib-link-record": { ...linkMonster, linkRating: "2", linkArrows: ["bottom-left", "bottom-right"], effect: textOfLength(700) },
    "effect-hyphenated-terms": { ...effectMonster, effect: HYPHENATED_TERMS_EFFECT },
    "pendulum-hyphenated-terms": {
        ...effectMonster,
        isPendulum: true,
        typeLine: "Mago/Pêndulo/Efeito",
        pendulumEffect: HYPHENATED_TERMS_EFFECT,
        effect: HYPHENATED_TERMS_EFFECT,
    },
    "effect-unbroken-word": {
        ...effectMonster,
        effect: `Quando esta carta for Invocada: ${UNBROKEN_WORD} e depois compre 1 card.`,
    },
    "pendulum-unbroken-word": {
        ...effectMonster,
        isPendulum: true,
        typeLine: "Mago/Pêndulo/Efeito",
        pendulumEffect: UNBROKEN_WORD,
        effect: UNBROKEN_WORD,
    },
};
