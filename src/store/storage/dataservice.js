const { BlobServiceClient, AnonymousCredential } = require("@azure/storage-blob");

const anonymousCredential = new AnonymousCredential();

const blobServiceClient = new BlobServiceClient(
  localStorage.getItem('storageaccountsas'),
  anonymousCredential
);

const containerClient = blobServiceClient.getContainerClient('nodes');

const getPins = async function () {
  const blobClient = containerClient.getBlobClient('pins');

  const downloadBlockBlobResponse = await blobClient.download();

  const pinsString = await blobToString(await downloadBlockBlobResponse.blobBody);

  async function blobToString(blob) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }

  return JSON.parse(pinsString).pins;
}


const savePin = async function (nodeId) {
  let pins = getPins();
  pins.push(nodeId);
  let pinsJSON = JSON.stringify(pins);
  const blockBlobClient = containerClient.getBlockBlobClient('pins');
  await blockBlobClient.upload(pinsJSON, pinsJSON.length);
  
  return pins;
}

const getNode = async function (nodeId) {

  const blobClient = containerClient.getBlobClient(nodeId);
  const blobProperties = await blobClient.getProperties();

  const downloadBlockBlobResponse = await blobClient.download();

  const nodeContent = await blobToString(await downloadBlockBlobResponse.blobBody);

  async function blobToString(blob) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }

  let nodeMetaData = JSON.parse(blobProperties.metadata.nodemeta);

  return {
    id: nodeId,
    content: nodeContent,
    metadata: nodeMetaData,
  };
};

const addNode = async function (newNode) {
  const blockBlobClient = containerClient.getBlockBlobClient(newNode.id);
  await blockBlobClient.upload(newNode.content, newNode.content.length);
  await blockBlobClient.setMetadata({ "nodemeta": JSON.stringify(newNode.metadata) });
};

const updateNode = async function (node) {
  let x = node;
  console.log(x);
  const blockBlobClient = containerClient.getBlockBlobClient(node.id);
  await blockBlobClient.upload(node.content, node.content.length);
  await blockBlobClient.setMetadata({ "nodemeta": JSON.stringify(node.metadata) });
};

const deleteNode = async function (nodeId) {
  console.log(nodeId);
};

const getMetadata = async function (nodeId) {
  const blobClient = containerClient.getBlobClient(nodeId);
  const blobProperties = await blobClient.getProperties();
  let nmds = JSON.parse(blobProperties.metadata.nodemeta);
  return nmds;
}

const setMetadata = async function (nodeId, metadata) {
  const blobClient = containerClient.getBlobClient(nodeId);

  await blobClient.setMetadata({ "nodemeta": JSON.stringify(metadata) });
  //{"title":"RootNode","ins":[],"outs":[]}
};

const resolveNode = async function (nodeId) {
  const blobClient = containerClient.getBlobClient(nodeId);
  const blobProperties = await blobClient.getProperties();
  let nmds = JSON.parse(blobProperties.metadata.nodemeta);
  return nmds.title;
};

export const nodeDataService = {
  getNode,
  addNode,
  updateNode,
  deleteNode,
  getMetadata,
  setMetadata,
  resolveNode,
  getPins,
  savePin
};
