export type ParsedToken = { id: number; bytes: Uint8Array; text: string };

function pairKey(left: number, right: number): string { return `${left}:${right}`; }

export class EmberTokenizer {
  readonly identifier: string;
  readonly version: string;
  readonly vocabSize: number;
  private readonly merges = new Map<string, number>();
  private readonly vocab = new Map<number, Uint8Array>();

  private constructor(identifier: string, version: string, vocabSize: number) {
    this.identifier = identifier;
    this.version = version;
    this.vocabSize = vocabSize;
    for (let index = 0; index < 256; index += 1) this.vocab.set(index, new Uint8Array([index]));
  }

  static fromFile(contents: string): EmberTokenizer {
    const lines = contents.replace(/^\uFEFF/, '').split(/\r?\n/);
    const [identifier = '', version = ''] = (lines.shift() ?? '').split('|').map((part) => part.trim());
    const vocabSize = Number.parseInt((lines.shift() ?? '').trim(), 10);
    if (!identifier || !version || !Number.isFinite(vocabSize)) throw new Error('Invalid Ember tokenizer header');
    const tokenizer = new EmberTokenizer(identifier, version, vocabSize);
    let id = 256;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const [left, right] = trimmed.split(/\s+/).map(Number);
      if (!Number.isInteger(left) || !Number.isInteger(right)) throw new Error(`Invalid merge pair: ${trimmed}`);
      tokenizer.merges.set(pairKey(left, right), id);
      const leftBytes = tokenizer.vocab.get(left);
      const rightBytes = tokenizer.vocab.get(right);
      if (!leftBytes || !rightBytes) throw new Error(`Unknown token in merge pair: ${trimmed}`);
      const merged = new Uint8Array(leftBytes.length + rightBytes.length);
      merged.set(leftBytes); merged.set(rightBytes, leftBytes.length);
      tokenizer.vocab.set(id, merged);
      id += 1;
    }
    return tokenizer;
  }

  private merge(ids: number[], left: number, right: number, replacement: number): number[] {
    const merged: number[] = [];
    let index = 0;
    while (index < ids.length) {
      if (index < ids.length - 1 && ids[index] === left && ids[index + 1] === right) { merged.push(replacement); index += 2; }
      else { merged.push(ids[index]); index += 1; }
    }
    return merged;
  }

  encode(text: string): number[] {
    let ids = Array.from(new TextEncoder().encode(text));
    while (ids.length >= 2) {
      let left = -1; let right = -1; let rank = Number.POSITIVE_INFINITY;
      for (let index = 0; index < ids.length - 1; index += 1) {
        const candidate = this.merges.get(pairKey(ids[index], ids[index + 1]));
        if (candidate !== undefined && candidate < rank) { left = ids[index]; right = ids[index + 1]; rank = candidate; }
      }
      if (left < 0) break;
      ids = this.merge(ids, left, right, rank);
    }
    return ids;
  }

  tokenBytes(id: number): Uint8Array {
    const bytes = this.vocab.get(id);
    if (!bytes) throw new Error(`Unknown token id: ${id}`);
    return bytes;
  }

  decode(ids: number[]): string {
    const bytes = ids.map((id) => this.tokenBytes(id));
    const output = new Uint8Array(bytes.reduce((total, item) => total + item.length, 0));
    let offset = 0;
    for (const item of bytes) { output.set(item, offset); offset += item.length; }
    return new TextDecoder().decode(output);
  }

  inspect(ids: number[]): ParsedToken[] {
    const decoder = new TextDecoder();
    return ids.map((id) => { const bytes = this.tokenBytes(id); return { id, bytes, text: decoder.decode(bytes) }; });
  }
}
