# Deocoin Explorer

A Deocoin blockchain explorer web application service for [Deocoincore Node](https://github.com/deocoincore/deocoincore-node) using the [Deocoin API](https://github.com/deocoincore/deocoin-insight-api).

## Getting Started

1. Install nvm https://github.com/creationix/nvm  
    We need Node 8. Nvm is a nice utility that allows easy switching between node versions.

    ```bash
    nvm i v8
    nvm use v8
    ```

2. Install mongo https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/  

    Then open a Mongodb client window and create a user and database:

    ```bash
    use deocoin-api-livenet
    db.createUser(
      {
        user: "deocoin",
        pwd: "mynewpassword",
        roles: [ "readWrite", "dbAdmin" ]
      }
    )
    ```

3. Deocoin wallet installation

    Compile the addressindex branch and make sure you have ZMQ installed

    ```bash
    # Dependencies
    sudo apt-get install build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils git cmake libboost-all-dev
    sudo apt-get install software-properties-common
    sudo add-apt-repository ppa:bitcoin/bitcoin
    sudo apt-get update
    sudo apt-get install libdb4.8-dev libdb4.8++-dev
    # with ZMQ
    sudo apt-get install libzmq3-dev

    # If you want to build the Qt GUI:
    sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler qrencode

    # Get the Deocoin wallet
    git clone https://github.com/deocoincore/deocoin
    cd deocoin
    git fetch origin
    git checkout addressindex

    # Note autogen will prompt to install some more dependencies if needed
    ./autogen.sh
    ./configure
    make -j2

    ```

4. Install deocoincore-node

    ```bash
    mkdir deocoinnode
    cd deocoinnode

    npm i deocoincore-node

    ./node_modules/.bin/deocoincore-node create mynode
    cd mynode

    ../node_modules/.bin/deocoincore-node install https://github.com/deocoincore/deocoin-insight-api.git#master
    ../node_modules/.bin/deocoincore-node install https://github.com/deocoincore/deocoin-explorer.git#master
    ```

5. Edit deocoincore-node.json to be similar to this (replace user with your username):

    ```json
      {
        "network": "livenet",
        "port": 3001,
        "services": [
          "deocoind",
          "web",
          "deocoin-insight-api",
          "deocoin-explorer"
        ],
        "servicesConfig": {
          "deocoin-explorer": {
            "apiPrefix": "deocoin-insight-api",
            "routePrefix": "deocoin-explorer",
            "nodemapLink": "https://deocoin.org/en/nodemap"
        },
          "deocoin-insight-api": {
            "routePrefix": "deocoin-insight-api",
            "db": {
              "user": "deocoin",
              "password": "mynewpassword",
              "host": "localhost",
              "port": 27017,
              "database": "deocoin-api-livenet"
            },
            "erc20": {
              "updateFromBlockHeight": 5000
            }
          },
          "deocoind": {
            "spawn": {
              "datadir": "/home/user/.deocoin",
              "exec": "/home/user/deocoin/src/deocoind"
            }
          }
        }
      }
    ```

6. Configure Deocoin and sync the blockchain

    ```bash
    cd ~
    mkdir .deocoin
    cd .deocoin
    touch deocoin.conf
    ```

    Edit deocoin.conf:

    ```bash
    server=1
    whitelist=127.0.0.1
    logevents=1
    txindex=1
    addressindex=1
    timestampindex=1
    spentindex=1
    par=2
    onlynet=ipv4
    maxconnections=24
    zmqpubrawtx=tcp://127.0.0.1:28332
    zmqpubhashblock=tcp://127.0.0.1:28332
    rpcallowip=127.0.0.1
    rpcuser=user
    rpcpassword=password
    rpcport=8332
    addrindex=1
    reindex=1
    ```

    Run deocoind and sync the chain:
    ```bash
    cd ~/deocoin/src
    ./deocoind &
    ```
    You can check the progress of the sync with the `deocoin-cli` command. Kill the daemon once the chain is synchronized.
    ```bash
    ./deocoin-cli getInfo

    pkill deocoind
    ```
    You only need to run deocoind once with `reindex=1` enabled. Once the chain is synced you can kill deocoind and comment the reindex setting in ~/.deocoin/deocoin.conf `#reindex=1`

7. Run Node (from the mynode folder):

    ```bash
    ../node_modules/.bin/deocoincore-node start
    ```  

8. Open a web browser to `http://localhost:3001/deocoin-explorer` or `http://localhost:3001/deocoin-insight-api`  

## Development

To run Insight UI locally in development mode:

Install dependencies:

```bash
npm install
```

To compile and minify the web application's assets:

```bash
grunt compile
```

There is a convenient Gruntfile.js for automation during editing the code

```bash
grunt
```

## Multi language support

Insight UI uses [angular-gettext](http://angular-gettext.rocketeer.be) for multi language support.

To enable a text to be translated, add the ***translate*** directive to html tags. See more details [here](http://angular-gettext.rocketeer.be/dev-guide/annotate/). Then, run:

```bash
grunt compile
```

This action will create a template.pot file in ***po/*** folder. You can open it with some PO editor ([Poedit](http://poedit.net)). Read this [guide](http://angular-gettext.rocketeer.be/dev-guide/translate/) to learn how to edit/update/import PO files from a generated POT file. PO file will be generated inside po/ folder.

If you make new changes, simply run **grunt compile** again to generate a new .pot template and the angular javascript ***js/translations.js***. Then (if use Poedit), open .po file and choose ***update from POT File*** from **Catalog** menu.

Finally changes your default language from ***public/src/js/config***

```javascript
gettextCatalog.currentLanguage = 'es';
```

This line will take a look at any *.po files inside ***po/*** folder, e.g.
**po/es.po**, **po/nl.po**. After any change do not forget to run ***grunt
compile***.

## Note

For more details about the [Deocoin API](https://github.com/deocoincore/deocoin-insight-api) configuration and end-points, go to [Deocoin API](https://github.com/deocoincore/deocoin-insight-api).
