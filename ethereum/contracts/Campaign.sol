pragma solidity ^0.4.17;

contract CampaignFactory {
    
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newContract = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newContract);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        string recipient_name;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string desc, uint val, address recip, string recip_name) public restricted {
        Request memory newReq = Request({
            description: desc,
            value: val,
            recipient: recip,
            recipient_name: recip_name,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newReq);
    }
    
    function approveRequest(uint requestIdx) public {
        Request storage request = requests[requestIdx]; //sotrage: to point to, and actually modify the real request
        
        require(approvers[msg.sender]); //check that the user is a contributor
        require(!request.approvals[msg.sender]); //check that the contributor hasn't voted yet
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
        
    }
    
    function finalizeRequest(uint requestIdx) public restricted {
        Request storage request = requests[requestIdx];
        
        require(!request.complete);
        require(request.approvalCount >= (approversCount / 2));
        
        //request approved, sending the eth to the recipient
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return(
            minimumContribution,
            this.balance, //current contract balance
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}