const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Marketplace', ([deployer, _prodajalec, kupec]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, 'Shared Mobility DAPP')
    })
  })

  describe('products', async () => {
    let result, stevilo_vozil

    before(async () => {
      result = await marketplace.dodaj_vozilo('iPhone X', web3.utils.toWei('1', 'Ether'), { from: _prodajalec })
      stevilo_vozil = await marketplace.stevilo_vozil()
    })

  it('doda vozilo', async () => {
    // SUCCESS
    assert.equal(stevilo_vozil, 1)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), stevilo_vozil.toNumber(), 'id is correct')
    assert.equal(event.ime, 'iPhone X', 'name is correct')
    assert.equal(event.cena, '1000000000000000000', 'price is correct')
    assert.equal(event.lastnik, _prodajalec, 'owner is correct')
    assert.equal(event.na_voljo, true, 'na voljo is correct')
  
    // FAILURE: Product must have a name
    await await marketplace.dodaj_vozilo('', web3.utils.toWei('1', 'Ether'), { from: _prodajalec }).should.be.rejected;
    // FAILURE: Product must have a price
    await await marketplace.dodaj_vozilo('iPhone X', 0, { from: _prodajalec }).should.be.rejected;
  })


  it('sells products', async () => {
    // Track the seller balance before purchase
    let oldSellerBalance
    oldSellerBalance = await web3.eth.getBalance(_prodajalec)
    oldSellerBalance = new web3.utils.BN(oldSellerBalance)
    console.log("AAAA")

    // SUCCESS: Buyer makes purchase
    result = await marketplace.sposodi_vozilo(stevilo_vozil, { from: kupec, value: web3.utils.toWei('1', 'Ether')})
    console.log("BBBB")

    // Check logs
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), stevilo_vozil.toNumber(), 'id is correct')
    assert.equal(event.ime, 'iPhone X', 'name is correct')
    assert.equal(event.cena, '1000000000000000000', 'price is correct')
    assert.equal(event.lastnik, kupec, 'owner is correct')
    assert.equal(event.na_voljo, false, 'purchased is correct')
  
    // Check that seller received funds
    let newSellerBalance
    newSellerBalance = await web3.eth.getBalance(_prodajalec)
    newSellerBalance = new web3.utils.BN(newSellerBalance)
  
    let cena
    cena = web3.utils.toWei('1', 'Ether')
    cena = new web3.utils.BN(cena)
  
    const exepectedBalance = oldSellerBalance.add(cena)
  
    assert.equal(newSellerBalance.toString(), exepectedBalance.toString())
  
    // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
    await marketplace.sposodi_vozilo(99, { from: kupec, cena: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
    // FAILURE: Buyer tries to buy without enough ether
    await marketplace.sposodi_vozilo(stevilo_vozil, { from: kupec, cena: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
    // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
    await marketplace.sposodi_vozilo(stevilo_vozil, { from: deployer, cena: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
    await marketplace.sposodi_vozilo(stevilo_vozil, { from: kupec, cena: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
  })
})
})

