import axios from "axios";

export async function uploadImagetoIPFS(fileImg) {
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGU5ZTQxYi04MTc1LTQwODEtYjhjNy03ZWI3YTQ5NWMxYzciLCJlbWFpbCI6InVtZXJhcmlmMDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjFlYWZhYjFmN2E1M2U2ZTkzZmI5Iiwic2NvcGVkS2V5U2VjcmV0IjoiNDI4NWFiYmE2YjU4MDAwNTgwNWUyNjQ3MWUyYjcwYzdkMTNhMjYzYmU3OTllNGU2ZTFkYTNmNmUxZDJlOTg2NCIsImlhdCI6MTY2MDY2NzMxMH0.2GkIGrrIotjCEyZxhC1gGGbnSxhmp2IQG_DtGCijkFI";
  try {
    const formData = new FormData();
    formData.append("file", fileImg);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${JWT}`,
      },
    });

    const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
    return imgHash;
  } catch (error) {
    console.log("Error sending File to IPFS: ");
    console.log(error);
  }
}
