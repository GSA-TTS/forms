import {
  type FormConfig,
  type Pattern,
  type PatternId,
  type PatternMap,
  generatePatternId,
  getPatternMap,
  removeChildPattern,
} from './pattern';
import {
  type FieldsetPattern,
  type PagePattern,
  type PageSetPattern,
  type SequencePattern,
} from './patterns';
import { type Blueprint, type FormOutput, type FormSummary } from './types';

export const nullBlueprint: Blueprint = {
  summary: {
    title: '',
    description: '',
  },
  root: 'root',
  patterns: {
    root: {
      type: 'sequence',
      id: 'root',
      data: {
        patterns: [],
      },
    } satisfies SequencePattern,
  },
  outputs: [],
};

export const createOnePageBlueprint = (): Blueprint => {
  const page1 = generatePatternId();
  return {
    summary: {
      title: '',
      description: '',
    },
    root: 'root',
    patterns: {
      root: {
        type: 'page-set',
        id: 'root',
        data: {
          pages: [page1],
        },
      } satisfies PageSetPattern,
      [page1]: {
        type: 'page',
        id: page1,
        data: {
          title: 'Page 1',
          patterns: [],
        },
      },
    },
    outputs: [],
  };
};

export const createForm = (
  summary: FormSummary,
  initial: {
    patterns: Pattern[];
    root: PatternId;
  } = {
    patterns: [
      {
        id: 'root',
        type: 'sequence',
        data: {
          patterns: [],
        },
      } satisfies SequencePattern,
    ],
    root: 'root',
  }
): Blueprint => {
  return {
    summary,
    root: initial.root,
    patterns: getPatternMap(initial.patterns),
    outputs: [],
  };
};

export const getRootPattern = (form: Blueprint) => {
  return form.patterns[form.root];
};

export const addPatternMap = (
  form: Blueprint,
  patterns: PatternMap,
  root?: PatternId
) => {
  return {
    ...form,
    patterns: { ...form.patterns, ...patterns },
    root: root !== undefined ? root : form.root,
  };
};

export const addPatterns = (
  form: Blueprint,
  patterns: Pattern[],
  root?: PatternId
) => {
  const formPatternMap = getPatternMap(patterns);
  return addPatternMap(form, formPatternMap, root);
};

export const addPatternToPage = (
  bp: Blueprint,
  pagePatternId: PatternId,
  pattern: Pattern,
  index?: number
): Blueprint => {
  const pagePattern = bp.patterns[pagePatternId] as PagePattern;
  if (pagePattern.type !== 'page') {
    throw new Error('Pattern is not a page.');
  }

  let updatedPagePattern: PatternId[];

  if (index !== undefined) {
    updatedPagePattern = [
      ...pagePattern.data.patterns.slice(0, index + 1),
      pattern.id,
      ...pagePattern.data.patterns.slice(index + 1),
    ];
  } else {
    updatedPagePattern = [...pagePattern.data.patterns, pattern.id];
  }

  return {
    ...bp,
    patterns: {
      ...bp.patterns,
      [pagePattern.id]: {
        ...pagePattern,
        data: {
          ...pagePattern.data,
          patterns: updatedPagePattern,
        },
      } satisfies SequencePattern,
      [pattern.id]: pattern,
    },
  };
};

export const movePatternBetweenPages = (
  bp: Blueprint,
  sourcePageId: PatternId,
  targetPageId: PatternId,
  patternId: PatternId,
  position: string
): Blueprint => {
  const sourcePage = bp.patterns[sourcePageId] as PagePattern;
  const targetPage = bp.patterns[targetPageId] as PagePattern;

  if (!sourcePage || !targetPage) {
    throw new Error('Source or target page not found.');
  }

  if (sourcePage.type !== 'page' || targetPage.type !== 'page') {
    throw new Error('Pattern is not a page.');
  }

  let updatedSourcePatterns: PatternId[];
  let updatedTargetPatterns: PatternId[];

  if (sourcePageId === targetPageId) {
    const sourcePagePatterns = sourcePage.data.patterns;
    const indexToRemove = sourcePagePatterns.indexOf(patternId);

    if (indexToRemove === -1) {
      throw new Error(`Pattern ID ${patternId} not found in the source page.`);
    }

    updatedSourcePatterns = [
      ...sourcePagePatterns.slice(0, indexToRemove),
      ...sourcePagePatterns.slice(indexToRemove + 1),
    ];

    updatedTargetPatterns =
      position === 'top'
        ? [patternId, ...updatedSourcePatterns]
        : [...updatedSourcePatterns, patternId];
  } else {
    const indexToRemove = sourcePage.data.patterns.indexOf(patternId);

    if (indexToRemove === -1) {
      throw new Error(`Pattern ID ${patternId} not found in the source page.`);
    }

    updatedSourcePatterns = [
      ...sourcePage.data.patterns.slice(0, indexToRemove),
      ...sourcePage.data.patterns.slice(indexToRemove + 1),
    ];

    updatedTargetPatterns =
      position === 'top'
        ? [patternId, ...targetPage.data.patterns]
        : [...targetPage.data.patterns, patternId];
  }

  return {
    ...bp,
    patterns: {
      ...bp.patterns,
      [sourcePageId]: {
        ...sourcePage,
        data: {
          ...sourcePage.data,
          patterns: updatedSourcePatterns,
        },
      } satisfies PagePattern,
      [targetPageId]: {
        ...targetPage,
        data: {
          ...targetPage.data,
          patterns: updatedTargetPatterns,
        },
      } satisfies PagePattern,
    },
  };
};

export const copyPattern = (
  bp: Blueprint,
  parentPatternId: PatternId,
  patternId: PatternId
): { bp: Blueprint; pattern: Pattern } => {
  const pattern = bp.patterns[patternId];
  if (!pattern) {
    throw new Error(`Pattern with id ${patternId} not found`);
  }

  const copySimplePattern = (pattern: Pattern): Pattern => {
    const newId = generatePatternId();
    const currentDate = new Date();
    const dateString = currentDate.toLocaleString();
    const newPattern: Pattern = {
      ...pattern,
      id: newId,
      data: { ...pattern.data },
    };

    if (newPattern.type === 'form-summary') {
      newPattern.data.title = `(Copy ${dateString}) ${newPattern.data.title || ''}`;
    } else if (
      newPattern.type === 'input' ||
      newPattern.type === 'radio-group' ||
      newPattern.type === 'checkbox'
    ) {
      newPattern.data.label = `(Copy ${dateString}) ${newPattern.data.label || ''}`;
    } else {
      newPattern.data.text = `(Copy ${dateString}) ${newPattern.data.text || ''}`;
    }

    return newPattern;
  };

  const copyFieldsetPattern = (pattern: Pattern): Pattern => {
    const newId = generatePatternId();
    const currentDate = new Date();
    const dateString = currentDate.toLocaleString();
    const newPattern: Pattern = {
      ...pattern,
      id: newId,
      data: { ...pattern.data },
    };

    if (newPattern.type === 'fieldset') {
      newPattern.data.legend = `(Copy ${dateString}) ${newPattern.data.legend || ''}`;
    }

    return newPattern;
  };

  const findParentFieldset = (
    bp: Blueprint,
    childId: PatternId
  ): PatternId | null => {
    for (const [id, pattern] of Object.entries(bp.patterns)) {
      if (
        pattern.type === 'fieldset' &&
        pattern.data.patterns.includes(childId)
      ) {
        return id as PatternId;
      }
    }
    return null;
  };

  const copyFieldsetContents = (
    bp: Blueprint,
    originalFieldsetId: PatternId,
    newFieldsetId: PatternId
  ): Blueprint => {
    const originalFieldset = bp.patterns[originalFieldsetId] as FieldsetPattern;
    const newFieldset = bp.patterns[newFieldsetId] as FieldsetPattern;
    let updatedBp = { ...bp };

    const idMap = new Map<PatternId, PatternId>();

    for (const childId of originalFieldset.data.patterns) {
      const childPattern = updatedBp.patterns[childId];
      if (childPattern) {
        const newChildPattern = copyFieldsetPattern(childPattern);
        idMap.set(childId, newChildPattern.id);

        updatedBp = {
          ...updatedBp,
          patterns: {
            ...updatedBp.patterns,
            [newChildPattern.id]: newChildPattern,
          },
        };

        if (childPattern.type === 'fieldset') {
          updatedBp = copyFieldsetContents(
            updatedBp,
            childId,
            newChildPattern.id
          );
        }
      }
    }

    newFieldset.data.patterns = originalFieldset.data.patterns.map(
      id => idMap.get(id) || id
    );

    updatedBp = {
      ...updatedBp,
      patterns: {
        ...updatedBp.patterns,
        [newFieldsetId]: newFieldset,
      },
    };

    return updatedBp;
  };

  let updatedBp = { ...bp };
  let newPattern = pattern;

  if (pattern.type === 'fieldset') {
    newPattern = copyFieldsetPattern(pattern);
  } else {
    newPattern = copySimplePattern(pattern);
  }

  const actualParentId = findParentFieldset(bp, patternId) || parentPatternId;
  const actualParent = updatedBp.patterns[actualParentId];

  if (
    !actualParent ||
    !actualParent.data ||
    !Array.isArray(actualParent.data.patterns)
  ) {
    throw new Error(`Invalid parent pattern with id ${actualParentId}`);
  }

  const originalIndex = actualParent.data.patterns.indexOf(patternId);
  if (originalIndex === -1) {
    throw new Error(
      `Pattern with id ${patternId} not found in parent's patterns`
    );
  }

  actualParent.data.patterns = [
    ...actualParent.data.patterns.slice(0, originalIndex + 1),
    newPattern.id,
    ...actualParent.data.patterns.slice(originalIndex + 1),
  ];

  updatedBp = {
    ...updatedBp,
    patterns: {
      ...updatedBp.patterns,
      [newPattern.id]: newPattern,
      [actualParentId]: actualParent,
    },
  };

  if (pattern.type === 'fieldset') {
    updatedBp = copyFieldsetContents(updatedBp, patternId, newPattern.id);
  }

  return { bp: updatedBp, pattern: newPattern };
};

export const addPatternToFieldset = (
  bp: Blueprint,
  fieldsetPatternId: PatternId,
  pattern: Pattern,
  index?: number
): Blueprint => {
  const fieldsetPattern = bp.patterns[fieldsetPatternId] as FieldsetPattern;
  if (fieldsetPattern.type !== 'fieldset') {
    throw new Error('Pattern is not a page.');
  }

  let updatedPagePattern: PatternId[];

  if (index !== undefined) {
    updatedPagePattern = [
      ...fieldsetPattern.data.patterns.slice(0, index + 1),
      pattern.id,
      ...fieldsetPattern.data.patterns.slice(index + 1),
    ];
  } else {
    updatedPagePattern = [...fieldsetPattern.data.patterns, pattern.id];
  }

  return {
    ...bp,
    patterns: {
      ...bp.patterns,
      [fieldsetPattern.id]: {
        ...fieldsetPattern,
        data: {
          ...fieldsetPattern.data,
          patterns: updatedPagePattern,
        },
      } satisfies FieldsetPattern,
      [pattern.id]: pattern,
    },
  };
};

export const addPageToPageSet = (
  bp: Blueprint,
  pattern: Pattern
): Blueprint => {
  const pageSet = bp.patterns[bp.root] as PageSetPattern;
  if (pageSet.type !== 'page-set') {
    throw new Error('Root pattern is not a page set.');
  }
  return {
    ...bp,
    patterns: {
      ...bp.patterns,
      [pageSet.id]: {
        ...pageSet,
        data: {
          pages: [...pageSet.data.pages, pattern.id],
        },
      } satisfies PageSetPattern,
      [pattern.id]: pattern,
    },
  };
};

export const replacePatterns = (
  form: Blueprint,
  patterns: Pattern[]
): Blueprint => {
  return {
    ...form,
    patterns: patterns.reduce(
      (acc, pattern) => {
        acc[pattern.id] = pattern;
        return acc;
      },
      {} as Record<PatternId, Pattern>
    ),
  };
};

export const updatePatterns = (
  config: FormConfig,
  form: Blueprint,
  newPatterns: PatternMap
): Blueprint => {
  const root = newPatterns[form.root];
  const targetPatterns: PatternMap = {
    [root.id]: root,
  };
  const patternConfig = config.patterns[root.type];
  const children = patternConfig.getChildren(root, newPatterns);
  targetPatterns[root.id] = root;
  children.forEach(child => (targetPatterns[child.id] = child));
  return {
    ...form,
    patterns: targetPatterns,
  };
};

export const addFormOutput = (
  form: Blueprint,
  document: FormOutput
): Blueprint => {
  return {
    ...form,
    outputs: [...form.outputs, document],
  };
};

export const updateFormSummary = (
  form: Blueprint,
  summary: FormSummary
): Blueprint => {
  return {
    ...form,
    summary,
  };
};

export const removePatternFromBlueprint = (
  config: FormConfig,
  blueprint: Blueprint,
  id: PatternId
) => {
  // Iterate over each pattern in the blueprint, and remove the target pattern
  // if it is a child.
  const patterns = Object.values(blueprint.patterns).reduce(
    (patterns, pattern) => {
      patterns[pattern.id] = removeChildPattern(config, pattern, id);
      return patterns;
    },
    {} as PatternMap
  );

  // Remove the pattern itself
  delete patterns[id];
  return {
    ...blueprint,
    patterns,
  };
};
