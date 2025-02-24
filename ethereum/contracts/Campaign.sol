pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);

        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public minimumContribution;
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string desc,
        uint256 val,
        address recipient
    ) public restricted {
        Request memory newReq = Request({
            description: desc,
            value: val,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newReq);
    }

    function approveRequest(uint256 idx) public {
        Request storage request = requests[idx];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 idx) public restricted {
        Request storage request = requests[idx];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (address, uint, uint, uint, uint)
    {
        return (
            manager,
            minimumContribution,
            this.balance,
            requests.length,
            approversCount
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
