export default class Paciente{
    private _id: string;
    private _nome: string;
    private _idade: number;
    private _data: Date;

    constructor(nome: string, idade: number, data: Date){
        this._nome = nome;
        this._idade = idade;
        this._data = data || new Date(); 
    }

	public get id(): string {
		return this._id;
	}

    
	public get nome(): string {
		return this._nome;
	}

	public get idade(): number {
		return this._idade;
	}


	public get data(): Date {
		return this._data;
	}

	public set id(value: string) {
		this._id = value;
	}


	public set nome(value: string) {
		this._nome = value;
	}

 
	public set idade(value: number) {
		this._idade = value;
	}


	public set data(value: Date) {
		this._data = value;
	}
    
}