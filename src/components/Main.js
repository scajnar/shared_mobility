import React, { Component } from 'react';

class Main extends Component {

  render() {

    return (
      <div id="content">
        <h1>Dodajte vozilo</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const ime = this.ime.value
          const cena = window.web3.utils.toWei(this.cena.value.toString(), 'Ether')
          const lokacija = this.lokacija.value
          const vrnjenaLokacija = this.vrnjenaLokacija.value;
          this.props.dodaj_vozilo(ime, cena, lokacija)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="ime"
              type="text"
              ref={(input) => { this.ime = input }}
              className="form-control"
              placeholder="Ime Vozila"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="cena"
              type="text"
              ref={(input) => { this.cena = input }}
              className="form-control"
              placeholder="Cena Izposoje"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="lokacija"
              type="text"
              ref={(input) => { this.lokacija = input }}
              className="form-control"
              placeholder="Lokacija"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Dodaj vozilo</button>
        </form>
        <p> </p>
        <h2>Sposodi vozilo</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ime</th>
              <th scope="col">Cena</th>
              <th scope="col">Lastnik</th>
              <th scope="col">Lokacija</th>
              <th scope="col">Sposojevalec</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.vozila.map((vozilo, key) => {
                return(
                    <tr key={key}>
                    <th scope="row">{vozilo.id.toString()}</th>
                    <td>{vozilo.ime}</td>
                    <td>{window.web3.utils.fromWei(vozilo.cena.toString(), 'Ether')} Eth</td>
                    <td>{vozilo.lastnik}</td>
                    <td>{vozilo.lokacija}</td>
                    <td>{vozilo.sposojevalec}</td>
                    <td>
                        { vozilo.na_voljo
                        ? <button
                            name={vozilo.id}
                            value={vozilo.cena}
                            onClick={(event) => {
                                this.props.sposodi_vozilo(event.target.name, event.target.value)
                            }}
                            >
                            Sposodi
                            </button>
                        : null
                        }
                        </td>
                    </tr>
                )
                })}
          
          </tbody>
        </table>
        <h2> Vrni vozilo</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ime</th>
              <th scope="col">Cena</th>
              <th scope="col">Lastnik</th>
              <th scope="col">Lokacija</th>
              <th scope="col">Sposojevalec</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.sposojenaVozila.map((sposojeno_vozilo, key) => {
                return( 
                    <tr key={key}>
                    <th scope="row">{sposojeno_vozilo.id.toString()}</th>
                    <td>{sposojeno_vozilo.ime}</td>
                    <td>{window.web3.utils.fromWei(sposojeno_vozilo.cena.toString(), 'Ether')} Eth</td>
                    <td>{sposojeno_vozilo.lastnik}</td>
                    <td>{sposojeno_vozilo.lokacija}</td>
                    <td>{sposojeno_vozilo.sposojevalec}</td>
                    <td>
                        { !sposojeno_vozilo.na_voljo
                        ? <button
                            type='button'
                            name={sposojeno_vozilo.id}
                            value={"Vrnjeno"}
                            onClick={(event) => {
                                this.props.vrni_vozilo(event.target.name, event.target.value)
                            }}
                            >
                            Vrni
                            </button>
                        : null
                        }
                        </td>
                    </tr>
                )
                })}
          </tbody>
        </table>
      </div>
    );

  }
}

export default Main;