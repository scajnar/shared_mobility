pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public stevilo_vozil = 0;
    mapping(uint => Vozilo) public vozila;

    constructor() public{
        name = "Shared Mobility DAPP";
    }
    struct Vozilo {
        uint id;
        string ime;
        uint cena;
        address payable lastnik;
        bool na_voljo;
        string lokacija;
        address payable sposojevalec;
    }

    event DodanoVozilo(
    uint id,
    string ime,
    uint cena,
    address payable lastnik,
    bool na_voljo,
    string lokacija,
    address payable sposojevalec
    );

    function dodaj_vozilo(string memory ime, uint cena_izposoje, string memory lokacija) public {
        require(bytes(ime).length > 0);
        require(cena_izposoje > 0);
        stevilo_vozil++;
        address payable null_sender = address(0);
        vozila[stevilo_vozil] = Vozilo(stevilo_vozil, ime, cena_izposoje, msg.sender, true, lokacija, null_sender );
        emit DodanoVozilo(stevilo_vozil, ime, cena_izposoje, msg.sender, true, lokacija, null_sender);
        
    }
    
    event VoziloSposojeno(
        uint id,
        string ime,
        uint cena,
        address payable lastnik,
        bool na_voljo,
        string lokacija,
        address payable sposojevalec
    );

    event VoziloVrnjeno(
        uint id,
        string ime,
        uint cena,
        address payable lastnik,
        bool na_voljo,
        string lokacija,
        address payable sposojevalec
    );

    function vrni_vozilo(uint _id, string memory lokacija) public{
        Vozilo memory _vozilo = vozila[_id];
        require(_vozilo.sposojevalec != _vozilo.lastnik);
        require(_vozilo.sposojevalec != address(0));
        require(_vozilo.na_voljo == false);
        _vozilo.sposojevalec = address(0);
        _vozilo.lokacija = lokacija;
        _vozilo.na_voljo = true;
        vozila[_id] = _vozilo;
        emit VoziloVrnjeno(_id, _vozilo.ime, _vozilo.cena, _vozilo.lastnik, _vozilo.na_voljo, _vozilo.lokacija, _vozilo.sposojevalec);
    }


    function sposodi_vozilo(uint _id) public payable{
    // Fetch the product
    Vozilo memory _vozilo = vozila[_id];
    // Fetch the owner
    address payable _prodajalec = _vozilo.lastnik;
    // Make sure the product has a valid id
    require(_vozilo.id > 0 && _vozilo.id <= stevilo_vozil);
    // Require that there is enough Ether in the transaction
    require(msg.value >= _vozilo.cena);
    // Require that the product has not been purchased already
    require(_vozilo.na_voljo);
    // Require that the buyer is not the seller
    require(_prodajalec != msg.sender);
    // Transfer ownership to the buyer
    //_vozilo.lastnik = msg.sender;
    _vozilo.sposojevalec = msg.sender;
    // Mark as purchased
    _vozilo.na_voljo = false;
    // Update the product
    //sprememba lokacije na v tranzitu
    _vozilo.lokacija = "V tranzitu";
    //_vozilo.lastnik = _vozilo.lastnik;
    vozila[_id] = _vozilo;
    
    // Pay the seller by sending them Ether
    address(_prodajalec).transfer(msg.value);
    // Trigger an event
    emit VoziloSposojeno(stevilo_vozil, _vozilo.ime, _vozilo.cena, _vozilo.lastnik, false, _vozilo.lokacija, _vozilo.sposojevalec);
    }

}