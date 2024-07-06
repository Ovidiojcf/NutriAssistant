export default class Paciente{
    private _id: string;
    private _nome: string;
    private _idade: number;
    private _data: Date;
	private _alergia: string[];
	private _comorbidades: string;
	private _habitoIntestinal: string;
	private _pesoAtual: string;
	private _pesoUsual: string;
	private _altura: string;
	private _imc: number; 
	private _uid : string;

    constructor(nome: string, idade: number, 
		data: Date, alergia : string[], comorbidades: string,
		habitoIntestinal: string, pesoAtual: string, pesoUsual: string,
		altura: string, imc : number
	){
        this._nome = nome;
        this._idade = idade;
        this._data = data || new Date();
		this._alergia = alergia;
		this._comorbidades = comorbidades;
		this._habitoIntestinal = habitoIntestinal;
		this._pesoAtual = pesoAtual;
		this._pesoUsual = pesoUsual;
		this._altura = altura;
		this._imc = imc;

    }

	public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
    	this._uid = value;
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
	public get alergia(): string[] {
		return this._alergia;
	  }
	  
	  public get comorbidades(): string {
		return this._comorbidades;
	  }
	  
	  public get habitoIntestinal(): string {
		return this._habitoIntestinal;
	  }
	  
	  public get pesoAtual(): string {
		return this._pesoAtual;
	  }
	  
	  public get pesoUsual(): string {
		return this._pesoUsual;
	  }
	  
	  public get altura(): string {
		return this._altura;
	  }
	  
	  public get imc(): number {
		return this._imc;
	  }
	  
	  public set alergia(value: string[]) {
		this._alergia = value;
	  }
	  
	  public set comorbidades(value: string) {
		this._comorbidades = value;
	  }
	  
	  public set habitoIntestinal(value: string) {
		this._habitoIntestinal = value;
	  }
	  
	  public set pesoAtual(value: string) {
		this._pesoAtual = value;
	  }
	  
	  public set pesoUsual(value: string) {
		this._pesoUsual = value;
	  }
	  
	  public set altura(value: string) {
		this._altura = value;
	  }
	  
	  public set imc(value: number) {
		this._imc = value;
	  }
	  
    
}