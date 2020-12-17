export class Upload {
  public files: File[] = []
  constructor(files: FileList) {
    this.files = Array.from(files)
  }
}
