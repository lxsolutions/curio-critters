
export interface MathItem {
  id: string;
  type: 'add' | 'sub';
  a: number[];
  b: number[];
  difficulty: number;
  tags: string[];
  standards?: string[];
}

// Embedded curriculum data for browser compatibility
const curriculumData = {
  items: [
    // Addition within 10 (no carry)
    {
      id: 'add_0_10_no_carry',
      type: 'add' as const,
      a: [0,1,2,3,4,5,6,7,8,9,10],
      b: [0,1,2,3,4,5,6,7,8,9,10],
      difficulty: 1,
      tags: ['within-10', 'no-carry', 'strategy:make-10']
    },
    // Subtraction within 10
    {
      id: 'sub_within_10',
      type: 'sub' as const,
      a: [1,2,3,4,5,6,7,8,9,10],
      b: [0,1,2,3,4,5,6,7,8,9],
      difficulty: 1,
      tags: ['within-10', 'subtraction']
    },
    // Addition within 20 (no carry)
    {
      id: 'add_0_20_no_carry',
      type: 'add' as const,
      a: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      b: [0,1,2,3,4,5,6,7,8,9,10],
      difficulty: 2,
      tags: ['within-20', 'no-carry']
    },
    // Subtraction within 20
    {
      id: 'sub_within_20',
      type: 'sub' as const,
      a: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      b: [0,1,2,3,4,5,6,7,8,9,10],
      difficulty: 2,
      tags: ['within-20', 'subtraction']
    },
    // Doubles facts
    {
      id: 'doubles_facts',
      type: 'add' as const,
      a: [1,2,3,4,5,6,7,8,9,10],
      b: [1,2,3,4,5,6,7,8,9,10],
      difficulty: 2,
      tags: ['doubles', 'within-20']
    },
    // Make 10 strategies
    {
      id: 'make_10_pairs',
      type: 'add' as const,
      a: [1,2,3,4,5,6,7,8,9],
      b: [9,8,7,6,5,4,3,2,1],
      difficulty: 3,
      tags: ['make-10', 'within-10', 'strategy:make-10']
    }
  ]
};

export async function loadCurriculum(): Promise<MathItem[]> {
  return curriculumData.items;
}

export function getMathItemById(id: string, curriculum: MathItem[]): MathItem | undefined {
  return curriculum.find(item => item.id === id);
}

export function filterMathItemsByDifficulty(
  curriculum: MathItem[], 
  minDifficulty: number, 
  maxDifficulty: number
): MathItem[] {
  return curriculum.filter(item => 
    item.difficulty >= minDifficulty && item.difficulty <= maxDifficulty
  );
}

export function filterMathItemsByTags(curriculum: MathItem[], tags: string[]): MathItem[] {
  return curriculum.filter(item => 
    tags.some(tag => item.tags.includes(tag))
  );
}

export function getRandomMathItem(curriculum: MathItem[]): MathItem {
  const randomIndex = Math.floor(Math.random() * curriculum.length);
  return curriculum[randomIndex];
}
