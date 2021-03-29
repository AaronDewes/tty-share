FROM go:1.16-buster

COPY . /go/src/github.com/AaronDewes/tty-share

RUN apt update && apt install -y git

RUN cd /go/src/github.com/AaronDewes/tty-share && \
    GOPATH=/go go get github.com/go-bindata/go-bindata/... && \
    GOPATH=/go /go/bin/go-bindata --prefix server/frontend/static -o gobindata.go server/frontend/static/* && \
    GOPATH=/go go build && \
    cp tty-share /usr/bin/ && \
    rm -r /go && \
    apt remove git -y

ENTRYPOINT ["/usr/bin/tty-share", "--command", "/bin/bash"]
