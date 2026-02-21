export interface FileObject {
	name: string
	mode: string
	mode_bits: number
	size: number
	is_file: boolean
	is_symlink: boolean
	mimetype: string
	created_at: string
	modified_at: string
}

export interface RenameFileEntry {
	from: string
	to: string
}

export interface ChmodFileEntry {
	file: string
	mode: number
}

export interface RenameFilesParams {
	root: string
	files: RenameFileEntry[]
}

export interface CopyFileParams {
	location: string
}

export interface DeleteFilesParams {
	root: string
	files: string[]
}

export interface CreateFolderParams {
	root?: string | null
	name: string
}

export interface CompressFilesParams {
	root?: string | null
	files: string[]
	name?: string | null
	extension?: 'zip' | 'tgz' | 'tar.gz' | 'txz' | 'tar.xz' | 'tbz2' | 'tar.bz2' | null
}

export interface DecompressFileParams {
	root?: string | null
	file: string
}

export interface ChmodFilesParams {
	root: string
	files: ChmodFileEntry[]
}

export interface PullFileParams {
	url: string
	directory?: string | null
	filename?: string | null
	use_header?: boolean
	foreground?: boolean
}

export interface WriteFileParams {
	/** Path of the file to write (passed as query param) */
	file: string
	/** Raw content to write */
	content: string
}
