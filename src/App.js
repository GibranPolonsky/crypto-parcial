import React from 'react';
import './App.css';
import { decrypt, decryptCajas, encrypt, encryptCajas } from './Crypto';
import Matrix from './Matrix';

class App extends React.Component {

  state = {
    message: '',
    secret: '',
    method: 'matrices',
    result: '',
    cryptedMessage: '',
    resultDecrypted: '',
    methods: [
      'cajas',
      'matrices'
    ]
  }


  downloadAsTxt = (string = "") => {
    const element = document.createElement("a");
    const file = new Blob([string], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "result.txt";
    element.click();
  }

  encrypt = () => {
    const { secret, message, method } = this.state;
    if(secret && message){
      const selectedMethod = method === 'matrices' ? encrypt : encryptCajas;
      const result = selectedMethod(message, secret);
      this.setState({ result });
    }else{
      alert("Debe ingresar el Código secreto y el mensaje");
    }
  }

  decrypt = () => {
    const { secret, cryptedMessage, method } = this.state;
    if(secret && cryptedMessage){
      const selectedMethod = method === 'matrices' ? decrypt : decryptCajas;
      const resultDecrypted = selectedMethod(cryptedMessage, secret);
      this.setState({resultDecrypted});
    }else{
      alert("Debe ingresar el Código secreto y el mensaje");
    }
    
  }

  export = () => {
    const { result } = this.state;
    if (result) {
      this.downloadAsTxt(result);
    }
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onChangeMatrixCode = (matrix) => {
    this.setState({
      secret: matrix,
    });
  }

  onImportFile = (e) => {
    const { files } = e.target;
    const fr = new FileReader();
    fr.onload = () => {
      this.setState({cryptedMessage: fr.result});
      this.decrypt();
    }
    fr.readAsText(files[0]);
  }

  render() {
    const { method, methods, secret, message, result, cryptedMessage, resultDecrypted } = this.state;


    let resultJSON = [];
    let resultRows = 0;
    let resultColumns = 0;
    let resultArray = [];
    if(result && method === 'matrices'){
      resultJSON = JSON.parse(result);


      resultColumns = resultJSON[0].length;
      resultRows = resultJSON.length;

      resultJSON.forEach(x => {
        resultArray = [...resultArray, ...x];
      });
    }
    

    return (
      <div className="container" style={{paddingBottom: 50}}>
        <div className="row">
          <div className="col-md-12">
            <div className="card ">
              <div className="card-body">
                <h1 className="display-4">Envío seguro de mensajes</h1>
                <h3>Configuracion Global</h3>
                <div className="form-group">
                  <label htmlFor="message">Metodo de encriptación</label>
                  <select value={method} onChange={this.onChange} className="form-control" name="method">
                    {methods.map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </div>
                {method === 'cajas' ? 
                  <div className="form-group">
                    <label htmlFor="secret">Código Secreto</label>
                    <input value={secret} type="text" className="form-control" name="secret" onChange={this.onChange} aria-describedby="emailHelp" />
                    <small id="emailHelp" className="form-text text-muted">No compartas este código públicamente</small>
                  </div>
                :
                <div>
                  <label htmlFor="secret">Código Secreto</label>
                  <Matrix rows={3} columns={3} onChange={this.onChangeMatrixCode}/>
                  <small id="emailHelp" className="form-text text-muted">No compartas este código públicamente</small>
                </div>
                }
                
              </div>
                
            </div>
            <br/><br/>
                      

            <h3>Encriptación</h3>
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea onChange={this.onChange} value={message} name="message" className="form-control" id="message" />
                </div>
                {result && <p>Tu resultado encriptado: </p>}
                <code>{result}</code>
                <br/><hr/>
                {result && method === 'matrices' &&
                  <Matrix size='55px' rows={resultRows} columns={resultColumns} data={resultArray} disabled={true} />
                }
                
                <br /><hr />
                <button onClick={this.encrypt} className="btn btn-primary">Cifrar</button>
                <button style={{ marginLeft: 20 }} onClick={this.export} className="btn btn-warning">Exportar</button>
              </div>
            </div>
            
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <br/><br/><br/>
            <h3>Desencriptación</h3>
            <hr />

            <div className="form-group">
              <label htmlFor="cryptedMessage">Mensaje Encriptado</label>
              <textarea onChange={this.onChange} value={cryptedMessage} name="cryptedMessage" className="form-control" id="cryptedMessage" />
            </div>
            {resultDecrypted && <p>Tu resultado: </p>}
            <code>{resultDecrypted}</code>
            <br /><hr />
            <label  className="btn btn-success">Importar
                <input onChange={this.onImportFile} type="file" style={{display: 'none'}}></input>
            </label>
            <button style={{ marginLeft: 20 }} onClick={this.decrypt} className="btn btn-primary">Descifrar</button>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
