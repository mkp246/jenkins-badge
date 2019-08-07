#!/bin/bash

# set openssl configuration to put extensions in ca.crt keyUsage=extendedKeyUsage,skid,akid (in user_crt section)
# also in csr (in v3_req section)
export OPENSSL_CONF=`pwd`/openssl.cnf

# generate ca key and certificate with extensions keyUsage=keyCertSign, cRLSign
# and extendedKeyUsage = serverAuth, clientAuth, codeSigning, emailProtection
# and skid,akid
# with basicConstraint CA:TRUE
# see openssl.cnf section usr_cert
openssl req -newkey rsa:2048 -x509 -keyout ca.key -out ca.crt -days 3650 -nodes -subj "/C=IN/ST=KA/L=BLR/O=MF/OU=ITOM/CN=mkp246 Root CA"

# generate intermediate chain key
# this produces csr with extensions keyUsage,extendedKeyUsage,skid,akid (in v3_req section)
# but for some reason these are dropped by openssl in during csr signing to get certificate
openssl genrsa -out intermediate.key

# generate intermediate certification request
# with extensions defined in openssl.cnf section v3_req 
openssl req -key intermediate.key -new -out intermediate.csr -subj "/C=IN/ST=KA/L=BLR/O=MF/OU=ITOM/CN=mkp246 intermediate CA"

# sign the intermediate csr with ca
# this produces intermediate.crt with extensions keyUsage,extendedKeyUsage,skid,akid
# see certificate.cnf section v3_inter_cert
openssl x509 -req -in intermediate.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out intermediate.crt -extfile certificate.cnf -extensions v3_inter_cert -days 3650

# generate server key
openssl genrsa -out server.key

# generate server certification request
# with extensions defined in openssl.cnf section v3_req 
openssl req -new -key server.key -out server.csr -subj "/C=IN/ST=KA/L=BLR/O=MF/OU=ITOM/CN=inmkumar1402.microfocus.com"

# sign server csr with intermediate.crt
# this produces server.crt with extensions skid,akid,subjectAltName
# see certificate.cnf section v3_server_cert, edit alt DNS names(subject Alterantive Names) in the above file
openssl x509 -req -in server.csr -CA intermediate.crt -CAkey intermediate.key -CAcreateserial -out server.crt -extfile certificate.cnf -extensions v3_server_cert -days 3650

# delete serial files generated
rm -f ca.srl intermediate.srl

# append chain(excluding root) to server certificate
# as certificate chain validation is requires on client side
# some client might still work without this if they already have chain certificates
cat intermediate.crt >> server.crt
