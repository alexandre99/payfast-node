# payfast-node
API-LAB que possui serviços de adicionar, confirmar, cancelar e pesquisar pagamentos. 
Possui serviços para fazer upload de arquivo e consulta de prazo de entrega através do webservice do correio.

Script para criar tabela no postgresql: CREATE TABLE pagamentos ( id serial NOT NULL, forma_de_pagamento character varying(255) NOT NULL, valor numeric(10,2) NOT NULL, moeda character varying(3) NOT NULL, status character varying(255) NOT NULL, data date, descricao text, CONSTRAINT pagamentos_pkey PRIMARY KEY (id) )

Passo a passo para fazer a instalação do Memcached no MAC, UBUNTU E WINDOWS:

Instalação no Mac utilizando o Brew

No Mac, uma forma simples e que abstrai todos os passos de instalação (inclusive as instalações das dependências) é utilizando o gerenciador de pacotes Brew. No terminal, digite:

brew install memcached

Caso você ainda não tenha o brew instalado, basta seguir os passos descritos na página oficial da ferramenta: http://brew.sh/ Basicamente, ele vai sugerir que você baixe-o pelo terminal e siga os passos conforme forem aparecendo.

/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Existem também formas de instalação alternativas na página do GitHub do projeto: https://github.com/Homebrew/brew/blob/master/share/doc/homebrew/Installation.md#installation

Uma vez instalado você pode utilizá-lo para instalar o Memcached e muitos outros pacotes. Instalação no Ubuntu

O Memcached pode ser ser instalado também via apt-get usando o seguinte comando:

sudo apt-get install memcached

Instalação no Windows

O Memcached é originalmente uma aplicação para Linux, mas por ser open-source, foram compiladas versões para outras plataformas também, como o Windows. Existem dois fontes principais para os binários em formato Windows: Jellycan e Northscale. As duas podem ser utilizadas normalmente como se usaria a versão original para Linux.

Abaixo os links para os binários das duas versões:

http://code.jellycan.com/files/memcached-1.2.5-win32-bin.zip
http://code.jellycan.com/files/memcached-1.2.6-win32-bin.zip
http://downloads.northscale.com/memcached-win32-1.4.4-14.zip
http://downloads.northscale.com/memcached-win64-1.4.4-14.zip
http://downloads.northscale.com/memcached-1.4.5-x86.zip
http://downloads.northscale.com/memcached-1.4.5-amd64.zip

Após o download, basta descompactar o arquivo para um diretório adequado e executar o binário.

Caso você queria configurar o Memcached para já executar sempre que o Windows iniciar, abra um prompt de comando com privilégios de administrador e execute o seguinte comando:

schtasks /create /sc onstart /tn memcached /tr "'c:\memcached\memcached.exe' -m 512"

Substituindo c:\memcached\memcached.exe pelo diretório utilizado na sua instalação.

Além do '-m 512' você também pode definir outros parâmetros para a execução do Memcached. Execute "c:\memcached\memcached.exe -h" para ver a lista de parâmetros disponíveis.

Da mesma forma se você não quiser mais que o Memcached suba junto com o Windows , basta desfazer o agendamento com o seguinte comando:

schtasks /delete /tn memcached

Para outros detalhes e formas de instalação, visite o link que foi usado como referência neste tutorial: https://commaster.net/content/installing-memcached-windows
