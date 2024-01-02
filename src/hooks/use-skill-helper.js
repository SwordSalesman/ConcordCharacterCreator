var skillData = require("../data/tables/skills.json");

export function getSkillNameAndRank(skill) {
    const parts = skill.split(" (");
    const base = parts[0];
    const num = parts.length > 1 ? parts[1].split(")")[0] : null;

    return { name: base, rank: num };
}

export function getNextSkillName(name) {
    const parts = name.split(" (");
    const base = parts[0];
    if (parts.length > 1) {
        const num = parts[1].split(")")[0];
        const newNum = Number.parseInt(num) + 1;
        return `${base} (${newNum})`;
    }
    return base;
}

export function getNextSkill(s) {
    return {
        name: getNextSkillName(s.name),
        tree: s.tree,
        cost: s.cost + s.costExtra,
        costExtra: s.costExtra,
        prereq: s.name,
        exclusion: s.exclusion ? s.exclusion : null,
    };
}

// Takes a list of skills with at least the name property,
//  and converts them to a ", " separated string, removing
//  all but the highest skill of the same type.
export function getSummarisedSkillNames(skills) {
    if (skills?.length < 1) return "None";

    return skills
        .filter((s) => {
            const { name, rank } = getSkillNameAndRank(s.name);
            if (!rank) {
                return true;
            } else {
                return !skills
                    .map((skill) => skill.name)
                    .includes(`${name} (${Number.parseInt(rank) + 1})`);
            }
        })
        .map((s) => s.name)
        .join(", ");
}

// Takes a summary from the above function and returns a list
//  of the skills that summary represents.
// skill: {name, tree, cost, costExtra, prereq?, exclusion?}
export function getFullSkillsFromSummary(summary) {
    if (summary === "None") return [];

    const names = summary.split(", ");

    const skillsAndNames = skillData.map((s) => {
        const { name: baseName } = getSkillNameAndRank(s.name);
        return { skill: s, baseName: baseName };
    });

    let additionalSkills = [];
    // name = "Juggernaut (2)"
    const skills = names.map((name) => {
        // baseName = "Juggernaut"
        const { name: baseName } = getSkillNameAndRank(name);
        const skillMatch = skillsAndNames.find(
            (element) => element.baseName === baseName
        );

        // This needs to be here to account for skill being removed from the pool
        if (skillMatch === undefined) {
            return null;
        }

        const skill = skillMatch.skill;

        // currSkill = {name: "Juggernaut", ...}
        let currSkill = skill;
        if (currSkill.costExtra !== undefined) {
            let i = 0;
            while (currSkill.name !== name && i < 10) {
                currSkill = getNextSkill(currSkill);
                additionalSkills.push(currSkill);
                i++;
            }
        }

        return skill;
    });

    return skills.filter((s) => s !== null).concat(additionalSkills);
}
