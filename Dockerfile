FROM golang:1.16-buster

COPY . /go/src/github.com/AaronDewes/tty-share

RUN cd /go/src/github.com/AaronDewes/tty-share && \
    GOPATH=/go go build && \
    cp tty-share /usr/bin/ && \
    rm -r /go
    
FROM debian:buster

COPY --from=builder /usr/bin/tty-share /usr/bin/tty-share

RUN groupadd -r ttyshare && useradd --no-log-init -r -g ttyshare ttyshare

USER ttyshare

ENTRYPOINT ["/usr/bin/tty-share", "--command", "/bin/bash"]
