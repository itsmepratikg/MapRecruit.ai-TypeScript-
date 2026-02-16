/**
 * Strips HTML tags from a string.
 * Used for cleaning skill names like <span><b>Warehouse</b></span>
 */
export const stripHtml = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
};

/**
 * Skill match categories based on recruitment logic
 */
export enum SkillMatchCategory {
    EXACT_MATCH = 'Exact match',
    EXACT_MATCH_NOT_RECENT = 'Exact match (Not Recent)',
    SIMILAR_SKILL = 'Similar / Related skill',
    NOT_MENTIONED = 'Not mentioned'
}

/**
 * Determines the category of a skill match based on MRI data.
 */
export const getSkillCategory = (skill: any): SkillMatchCategory => {
    const matchType = skill.matchType;
    const matchSummary = skill.matchSummary?.toLowerCase() || '';
    const relation = skill.relation?.toLowerCase() || '';

    if (matchType === 'Matched') {
        if (matchSummary.includes('used this skill recently')) {
            return SkillMatchCategory.EXACT_MATCH;
        }
        return SkillMatchCategory.EXACT_MATCH_NOT_RECENT;
    }

    if (matchType === 'RELATED' || (relation && relation !== 'canonical')) {
        return SkillMatchCategory.SIMILAR_SKILL;
    }

    return SkillMatchCategory.NOT_MENTIONED;
};

/**
 * Formats a score from 0-1 scale to 0-10 or 0-100
 */
export const formatMatchScore = (score: number): number => {
    if (score === undefined || score === null) return 0;
    // If the score is already >= 1, we assume it's on a 0-10 scale (as per feedback)
    // If it's < 1, we scale it to 10
    if (score > 10) return 10;
    if (score > 1) return Math.round(score * 10) / 10; // Round to 1 decimal place
    return Math.round(score * 10);
};
